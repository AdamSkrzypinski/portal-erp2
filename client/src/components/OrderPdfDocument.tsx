import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import type { Order } from '../types';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 11,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyInfo: {
    textAlign: 'right',
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    color: '#666',
    marginBottom: 4,
    fontSize: 9,
  },
  value: {
    fontSize: 12,
    marginBottom: 8,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    height: 24,
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
  },
  colName: { width: '70%', paddingLeft: 5 },
  colQty: { width: '30%', paddingRight: 5, textAlign: 'right' },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

interface OrderPdfProps {
  order: Order;
}

export function OrderPdfDocument({ order }: OrderPdfProps) {
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Potwierdzenie Zamówienia</Text>
            <Text style={{ marginTop: 5, color: '#009879' }}>{order.orderNumber}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Firma Sp. j.</Text>
            <Text>ul. Przemysłowa 10</Text>
            <Text>00-999 Warszawa</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.section}>
            <Text style={styles.label}>Data wystawienia:</Text>
            <Text style={styles.value}>{new Date(order.dateIssued).toLocaleDateString('pl-PL')}</Text>
            
            <Text style={styles.label}>Planowana dostawa:</Text>
            <Text style={styles.value}>{new Date(order.deliveryDate).toLocaleDateString('pl-PL')}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Status:</Text>
            <Text style={{ ...styles.value, color: '#009879' }}>ZATWIERDZONE</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colName}>Nazwa Produktu</Text>
            <Text style={styles.colQty}>Ilość</Text>
          </View>

          {items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colName}>{item.name}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Suma: {order.totalAmount} {order.currency}</Text>
        </View>

        <Text style={{ position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#ccc', fontSize: 9 }}>
          Dokument wygenerowany automatycznie w Portalu B2B - ERP II
        </Text>

      </Page>
    </Document>
  );
}