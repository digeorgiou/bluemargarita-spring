package gr.aueb.cf.bluemargarita.dto.stock;

import java.time.LocalDateTime;

/**
 * DTO for stock update results
 */
public record StockUpdateResultDTO(
        Long productId,
        String productCode,
        Integer previousStock,
        Integer newStock,
        Integer changeAmount,
        boolean success,

        String operationType,        // "ADD", "REMOVE", "SET"
        LocalDateTime updatedAt
) {
}
