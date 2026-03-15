package com.example.bookstore.repository;

import com.example.bookstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  org.springframework.data.domain.Page<Order> findByOrderStatus(String orderStatus,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserId(Long userId,
      org.springframework.data.domain.Pageable pageable);

  org.springframework.data.domain.Page<Order> findByUserIdAndOrderStatus(Long userId, String orderStatus,
      org.springframework.data.domain.Pageable pageable);
}
