package gr.aueb.cf.bluemargarita.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "sale_product")
public class SaleProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(precision = 8, scale = 3, nullable = false)
    private BigDecimal quantity;

    /* Keeping name and price at the time of the sale,
    for historical data of sales, in case products gets deleted or updated.
    */
    @Column(name = "product_description_snapshot")
    private String productNameSnapshot;

    // This stores the ACTUAL selling price after discount
    @Column(name = "price_at_the_time", precision = 10, scale = 2)
    private BigDecimal priceAtTheTime;


    @Column(name = "wholesale_price_at_the_time", precision = 10, scale = 2)
    private BigDecimal wholesalePriceAtTheTime;

    // this stores the suggested price before discount
    @Column(name = "suggested_price_at_the_time", precision = 10, scale = 2)
    private BigDecimal suggestedPriceAtTheTime;

}
