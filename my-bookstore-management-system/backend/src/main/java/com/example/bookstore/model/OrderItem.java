package com.example.bookstore.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class OrderItem {
    @Column(name = "book_id")
    private Long bookId;

    private String title;
    private String author;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "unit_price")
    private double unitPrice;

    private int quantity;

    @Column(name = "line_total")
    private double lineTotal;

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(double lineTotal) {
        this.lineTotal = lineTotal;
    }
}
