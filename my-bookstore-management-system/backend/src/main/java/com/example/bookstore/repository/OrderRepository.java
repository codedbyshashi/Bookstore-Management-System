package com.example.bookstore.repository;

import com.example.bookstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  org.springframework.data.domain.Page<Order> findByOrderStatus(String orderStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByPaymentStatus(String paymentStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByOrderStatusAndPaymentStatus(String orderStatus, String paymentStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserId(Long userId,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserIdAndPaymentStatus(Long userId, String paymentStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserIdAndOrderStatus(Long userId, String orderStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserIdAndOrderStatusAndPaymentStatus(Long userId, String orderStatus,
      String paymentStatus, org.springframework.data.domain.Pageable pageable);
}
