package com.banking.backend.service;

import com.banking.backend.entity.Transaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;
import java.math.BigDecimal;
import java.util.List;

@Service
public class StatementService {

    public void exportToPdf(List<Transaction> transactions, OutputStream outputStream) throws DocumentException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);

        Paragraph paragraph = new Paragraph("Bank Account Statement", fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraph);
        
        document.add(new Paragraph(" ")); // Spacer

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] { 3.0f, 2.0f, 4.0f, 2.5f, 2.0f });
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table, transactions);

        document.add(table);
        document.close();
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(java.awt.Color.WHITE);

        cell.setPhrase(new Phrase("Date", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Type", font));
        table.addCell(cell);
        
        cell.setPhrase(new Phrase("Description", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);
        
        cell.setPhrase(new Phrase("Status", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table, List<Transaction> transactions) {
        for (Transaction tx : transactions) {
            table.addCell(tx.getTimestamp().toString());
            table.addCell(tx.getType());
            table.addCell(tx.getDescription());
            table.addCell("$" + tx.getAmount());
            table.addCell("Completed");
        }
    }

    public void exportToCsv(List<Transaction> transactions, Writer writer) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            String[] header = { "Transaction ID", "Date", "Type", "Description", "Amount", "Status" };
            csvWriter.writeNext(header);

            for (Transaction tx : transactions) {
                String[] data = {
                    String.valueOf(tx.getId()),
                    tx.getTimestamp().toString(),
                    tx.getType(),
                    tx.getDescription(),
                    tx.getAmount().toString(),
                    "Completed"
                };
                csvWriter.writeNext(data);
            }
        }
    }
}
