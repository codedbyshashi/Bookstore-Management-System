package com.example.bookstore.service;

import com.example.bookstore.dto.OrderDto;
import com.example.bookstore.dto.OrderItemDto;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.model.Book;
import com.example.bookstore.model.Order;
import com.example.bookstore.model.OrderItem;
import com.example.bookstore.repository.BookRepository;
import com.example.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getOrders(String orderStatus, String paymentStatus, Pageable pageable) {
        Page<Order> page = findOrders(null, orderStatus, paymentStatus, pageable);
        List<OrderDto> dtos = page.getContent().stream().map(this::mapToDto).toList();
        return buildPageResponse(page, dtos);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getOrdersForUser(Long userId, String orderStatus, String paymentStatus, Pageable pageable) {
        Page<Order> page = findOrders(userId, orderStatus, paymentStatus, pageable);
        List<OrderDto> dtos = page.getContent().stream().map(this::mapToDto).toList();
        return buildPageResponse(page, dtos);
    }

    @Transactional(readOnly = true)
    public Optional<OrderDto> getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(this::mapToDto);
    }

    @Transactional
    public OrderDto placeOrder(OrderDto orderDto) {
        LinkedHashMap<Long, Integer> requestedQuantities = normalizeRequestedQuantities(orderDto);
        List<OrderItem> orderItems = buildOrderItemsFromStock(requestedQuantities, true);

        Order order = new Order();
        order.setUserId(orderDto.getUserId());
        order.setBookIds(new ArrayList<>(requestedQuantities.keySet()));
        order.setItems(orderItems);
        order.setItemCount(orderItems.stream().mapToInt(OrderItem::getQuantity).sum());
        order.setTotalAmount(orderItems.stream().mapToDouble(OrderItem::getLineTotal).sum());
        order.setOrderStatus(resolveOrderStatus(orderDto.getOrderStatus()));
        order.setPaymentStatus(resolvePaymentStatus(orderDto.getPaymentStatus()));
        order.setPaymentMethod(resolvePaymentMethod(orderDto.getPaymentMethod(), order.getPaymentStatus()));

        Order saved = orderRepository.save(order);
        return mapToDto(saved);
    }

    @Transactional
    public OrderDto updateOrder(Long orderId, OrderDto updatedValues) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        String currentStatus = resolveOrderStatus(order.getOrderStatus());
        String nextStatus = updatedValues.getOrderStatus() == null || updatedValues.getOrderStatus().isBlank()
                ? currentStatus
                : resolveOrderStatus(updatedValues.getOrderStatus());

        if (!Objects.equals(currentStatus, nextStatus)) {
            handleInventoryForStatusTransition(order, currentStatus, nextStatus);
            order.setOrderStatus(nextStatus);
        }

        if (updatedValues.getPaymentStatus() != null && !updatedValues.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(resolvePaymentStatus(updatedValues.getPaymentStatus()));
        }

        if (updatedValues.getPaymentMethod() != null && !updatedValues.getPaymentMethod().isBlank()) {
            order.setPaymentMethod(resolvePaymentMethod(updatedValues.getPaymentMethod(), order.getPaymentStatus()));
        } else {
            order.setPaymentMethod(resolvePaymentMethod(order.getPaymentMethod(), order.getPaymentStatus()));
        }

        return mapToDto(orderRepository.save(order));
    }

    private Page<Order> findOrders(Long userId, String orderStatus, String paymentStatus, Pageable pageable) {
        boolean hasStatus = orderStatus != null && !orderStatus.isBlank();
        boolean hasPaymentStatus = paymentStatus != null && !paymentStatus.isBlank();

        if (userId == null) {
            if (hasStatus && hasPaymentStatus) {
                return orderRepository.findByOrderStatusAndPaymentStatus(resolveOrderStatus(orderStatus),
                        resolvePaymentStatus(paymentStatus), pageable);
            }
            if (hasStatus) {
                return orderRepository.findByOrderStatus(resolveOrderStatus(orderStatus), pageable);
            }
            if (hasPaymentStatus) {
                return orderRepository.findByPaymentStatus(resolvePaymentStatus(paymentStatus), pageable);
            }
            return orderRepository.findAll(pageable);
        }

        if (hasStatus && hasPaymentStatus) {
            return orderRepository.findByUserIdAndOrderStatusAndPaymentStatus(userId, resolveOrderStatus(orderStatus),
                    resolvePaymentStatus(paymentStatus), pageable);
        }
        if (hasStatus) {
            return orderRepository.findByUserIdAndOrderStatus(userId, resolveOrderStatus(orderStatus), pageable);
        }
        if (hasPaymentStatus) {
            return orderRepository.findByUserIdAndPaymentStatus(userId, resolvePaymentStatus(paymentStatus), pageable);
        }
        return orderRepository.findByUserId(userId, pageable);
    }

    private PageResponse<OrderDto> buildPageResponse(Page<Order> page, List<OrderDto> dtos) {
        return new PageResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast());
    }

    private LinkedHashMap<Long, Integer> normalizeRequestedQuantities(OrderDto orderDto) {
        LinkedHashMap<Long, Integer> quantities = new LinkedHashMap<>();

        if (orderDto.getItems() != null && !orderDto.getItems().isEmpty()) {
            for (OrderItemDto item : orderDto.getItems()) {
                if (item.getBookId() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each order item must include a book ID");
                }
                if (item.getQuantity() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order quantity must be at least 1");
                }
                quantities.merge(item.getBookId(), item.getQuantity(), Integer::sum);
            }
        } else if (orderDto.getBookIds() != null && !orderDto.getBookIds().isEmpty()) {
            for (Long bookId : orderDto.getBookIds()) {
                if (bookId == null) {
                    continue;
                }
                quantities.merge(bookId, 1, Integer::sum);
            }
        }

        if (quantities.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your order does not contain any books");
        }

        return quantities;
    }

    private List<OrderItem> buildOrderItemsFromStock(Map<Long, Integer> requestedQuantities, boolean reserveStock) {
        Map<Long, Book> booksById = bookRepository.findAllById(requestedQuantities.keySet()).stream()
                .collect(Collectors.toMap(Book::getId, Function.identity()));
        List<Book> booksToSave = new ArrayList<>();
        List<OrderItem> orderItems = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : requestedQuantities.entrySet()) {
            Long bookId = entry.getKey();
            int requestedQuantity = entry.getValue();

            Book book = booksById.get(bookId);
            if (book == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book #" + bookId + " was not found");
            }

            if (requestedQuantity <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order quantity must be at least 1");
            }

            if (reserveStock) {
                if (book.getStockQuantity() < requestedQuantity) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            book.getTitle() + " only has " + book.getStockQuantity() + " left in stock");
                }
                book.setStockQuantity(book.getStockQuantity() - requestedQuantity);
                booksToSave.add(book);
            }

            OrderItem item = new OrderItem();
            item.setBookId(book.getId());
            item.setTitle(book.getTitle());
            item.setAuthor(book.getAuthor());
            item.setImageUrl(book.getImageUrl());
            item.setUnitPrice(book.getPrice());
            item.setQuantity(requestedQuantity);
            item.setLineTotal(book.getPrice() * requestedQuantity);
            orderItems.add(item);
        }

        if (reserveStock && !booksToSave.isEmpty()) {
            bookRepository.saveAll(booksToSave);
        }

        return orderItems;
    }

    private void handleInventoryForStatusTransition(Order order, String currentStatus, String nextStatus) {
        if (!"CANCELLED".equals(currentStatus) && "CANCELLED".equals(nextStatus)) {
            restoreStockForOrder(order);
            return;
        }

        if ("CANCELLED".equals(currentStatus) && !"CANCELLED".equals(nextStatus)) {
            reserveStockForExistingOrder(order);
        }
    }

    private void restoreStockForOrder(Order order) {
        Map<Long, Integer> quantities = extractQuantitiesFromOrder(order);
        if (quantities.isEmpty()) {
            return;
        }

        List<Book> books = bookRepository.findAllById(quantities.keySet());
        for (Book book : books) {
            int quantity = quantities.getOrDefault(book.getId(), 0);
            book.setStockQuantity(book.getStockQuantity() + quantity);
        }
        bookRepository.saveAll(books);
    }

    private void reserveStockForExistingOrder(Order order) {
        Map<Long, Integer> quantities = extractQuantitiesFromOrder(order);
        buildOrderItemsFromStock(quantities, true);
    }

    private Map<Long, Integer> extractQuantitiesFromOrder(Order order) {
        LinkedHashMap<Long, Integer> quantities = new LinkedHashMap<>();

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (OrderItem item : order.getItems()) {
                if (item.getBookId() == null) {
                    continue;
                }
                quantities.merge(item.getBookId(), item.getQuantity(), Integer::sum);
            }
            return quantities;
        }

        if (order.getBookIds() != null) {
            for (Long bookId : order.getBookIds()) {
                if (bookId == null) {
                    continue;
                }
                quantities.merge(bookId, 1, Integer::sum);
            }
        }

        return quantities;
    }

    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        List<OrderItemDto> items = resolveOrderItems(order);
        int derivedItemCount = items.stream().mapToInt(OrderItemDto::getQuantity).sum();
        double derivedTotalAmount = items.stream().mapToDouble(OrderItemDto::getLineTotal).sum();
        Integer storedItemCount = order.getItemCount();
        Double storedTotalAmount = order.getTotalAmount();

        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setBookIds(order.getBookIds() != null && !order.getBookIds().isEmpty()
                ? order.getBookIds()
                : items.stream().map(OrderItemDto::getBookId).toList());
        dto.setItems(items);
        dto.setItemCount(storedItemCount != null && storedItemCount > 0
                ? storedItemCount
                : derivedItemCount);
        dto.setTotalAmount(storedTotalAmount != null && storedTotalAmount > 0
                ? storedTotalAmount
                : derivedTotalAmount);
        dto.setOrderStatus(resolveOrderStatus(order.getOrderStatus()));
        dto.setPaymentStatus(resolvePaymentStatus(order.getPaymentStatus()));
        dto.setPaymentMethod(resolvePaymentMethod(order.getPaymentMethod(), order.getPaymentStatus()));
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    private List<OrderItemDto> resolveOrderItems(Order order) {
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            return order.getItems().stream().map(this::mapItemToDto).toList();
        }

        Map<Long, Integer> quantities = extractQuantitiesFromOrder(order);
        if (quantities.isEmpty()) {
            return List.of();
        }

        Map<Long, Book> booksById = bookRepository.findAllById(quantities.keySet()).stream()
                .collect(Collectors.toMap(Book::getId, Function.identity()));

        List<OrderItemDto> fallbackItems = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : quantities.entrySet()) {
            Book book = booksById.get(entry.getKey());
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setBookId(entry.getKey());
            itemDto.setQuantity(entry.getValue());

            if (book != null) {
                itemDto.setTitle(book.getTitle());
                itemDto.setAuthor(book.getAuthor());
                itemDto.setImageUrl(book.getImageUrl());
                itemDto.setUnitPrice(book.getPrice());
                itemDto.setLineTotal(book.getPrice() * entry.getValue());
            } else {
                itemDto.setTitle("Book #" + entry.getKey());
                itemDto.setAuthor("Unavailable");
                itemDto.setImageUrl("");
                itemDto.setUnitPrice(0);
                itemDto.setLineTotal(0);
            }

            fallbackItems.add(itemDto);
        }

        return fallbackItems;
    }

    private OrderItemDto mapItemToDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setBookId(item.getBookId());
        dto.setTitle(item.getTitle());
        dto.setAuthor(item.getAuthor());
        dto.setImageUrl(item.getImageUrl());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setLineTotal(item.getLineTotal());
        return dto;
    }

    private String resolveOrderStatus(String orderStatus) {
        return orderStatus == null || orderStatus.isBlank() ? "PENDING" : orderStatus;
    }

    private String resolvePaymentStatus(String paymentStatus) {
        return paymentStatus == null || paymentStatus.isBlank() ? "UNPAID" : paymentStatus;
    }

    private String resolvePaymentMethod(String paymentMethod, String paymentStatus) {
        if (paymentMethod != null && !paymentMethod.isBlank()) {
            return paymentMethod;
        }

        if ("PAY_ON_DELIVERY".equals(paymentStatus)) {
            return "CASH_ON_DELIVERY";
        }

        if ("PAID".equals(paymentStatus) || "PENDING_PAYMENT".equals(paymentStatus)
                || "UNPAID".equals(paymentStatus)) {
            return "ONLINE_PAYMENT";
        }

        return "ONLINE_PAYMENT";
    }
}
