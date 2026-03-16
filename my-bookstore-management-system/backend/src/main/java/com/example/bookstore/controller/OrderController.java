package com.example.bookstore.controller;

import com.example.bookstore.dto.OrderDto;
import com.example.bookstore.dto.PageResponse;
import com.example.bookstore.service.OrderService;
import com.example.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<PageResponse<OrderDto>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        PageResponse<OrderDto> orders;

        boolean isAdmin = authentication != null
                && authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        if (!isAdmin && authentication != null) {
            Long userId = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();
            orders = orderService.getOrdersForUser(userId, status, paymentStatus, pageable);
        } else {
            orders = orderService.getOrders(status, paymentStatus, pageable);
        }

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(@RequestBody OrderDto orderDto, Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required to place an order");
        }

        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins cannot place customer orders");
        }

        Long userId = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        orderDto.setUserId(userId);
        OrderDto createdOrder = orderService.placeOrder(orderDto);
        return ResponseEntity.status(201).body(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.updateOrder(id, orderDto);
        return ResponseEntity.ok(updatedOrder);
    }
}
