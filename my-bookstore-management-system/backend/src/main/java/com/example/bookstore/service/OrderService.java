package com.example.bookstore.service;

import com.example.bookstore.dto.OrderDto;
import com.example.bookstore.model.Order;
import com.example.bookstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookstore.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public PageResponse<OrderDto> getOrders(String orderStatus, Pageable pageable) {
        Page<com.example.bookstore.model.Order> page;
        if (orderStatus == null || orderStatus.isBlank()) {
            page = orderRepository.findAll(pageable);
        } else {
            page = orderRepository.findByOrderStatus(orderStatus, pageable);
        }
        List<OrderDto> dtos = page.getContent().stream().map(this::mapToDto).toList();

        return new PageResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast());
    }

    public PageResponse<OrderDto> getOrdersForUser(Long userId, String orderStatus, Pageable pageable) {
        Page<com.example.bookstore.model.Order> page;
        if (orderStatus == null || orderStatus.isBlank()) {
            page = orderRepository.findByUserId(userId, pageable);
        } else {
            page = orderRepository.findByUserIdAndOrderStatus(userId, orderStatus, pageable);
        }
        List<OrderDto> dtos = page.getContent().stream().map(this::mapToDto).toList();

        return new PageResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast());
    }

    public Optional<OrderDto> getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(this::mapToDto);
    }

    public OrderDto placeOrder(OrderDto orderDto) {
        Order order = mapToEntity(orderDto);
        Order saved = orderRepository.save(order);
        return mapToDto(saved);
    }

    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        return mapToDto(orderRepository.save(order));
    }

    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setBookIds(order.getBookIds());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentMethod(resolvePaymentMethod(order.getPaymentMethod(), order.getPaymentStatus()));
        return dto;
    }

    private Order mapToEntity(OrderDto dto) {
        Order order = new Order();
        if (dto.getId() != null) {
            order.setId(dto.getId());
        }
        order.setUserId(dto.getUserId());
        order.setBookIds(dto.getBookIds());
        order.setOrderStatus(dto.getOrderStatus());
        order.setPaymentStatus(dto.getPaymentStatus());
        order.setPaymentMethod(resolvePaymentMethod(dto.getPaymentMethod(), dto.getPaymentStatus()));
        return order;
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
