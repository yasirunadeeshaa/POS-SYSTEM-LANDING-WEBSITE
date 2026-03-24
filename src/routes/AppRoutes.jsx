import { Routes, Route, Navigate } from "react-router-dom";

//main pages
import HeroSection from "../pages/main/Herosection";
import FeatureSection from "../pages/main/Feature";
import Navigation from "../components/Navigation";
import ModuleSection from "../pages/main/ModuleSection";
import HowItWorks from "../pages/main/HowItWorks";
import Footer from "../components/Footer";
import ComparisonSection from "../pages/main/Comparisonsection";

//auth
import Login from "../pages/auth/Login";

//dashboard
import Dashboard from "../pages/dashboards/PosDashboard";

//Inventory
import Quotation from "../pages/sales/Quotation";
import QuotationSummery from "../pages/sales/QuotationSummaryModel";
import QuotationHistory from "../pages/history/QutationHistory";
import ProductListView from "../pages/product/ProductManagement";
import ProductSelectionModal from "../pages/product/ProductSelection";
import CategoryManagement from "../pages/product/CaregoryManagement";
import PurchaseOrder from "../pages/product/PurchaseOrder";
import Invoice from "../pages/sales/Invoice";
import AddProduct from "../pages/product/Addproduct";
import InvoiceHistory from "../pages/sales/InvoiceHistory";
import GRN from "../pages/sales/GRN";
import PurchaseOrderHistory from "../pages/history/PurchaseOrderHistory";
import CreditNote from "../pages/sales/CreditNote";
import DebitNote from "../pages/sales/DebitNote";

//Customer
import CustomerManagement from "../pages/customers/CustomerManagement";
import AddCustomer from "../pages/customers/AddCustomer";

//supplier
import SupplierManagement from "../pages/suppliers/SupplierManagement";
import SupplierAccount from "../pages/suppliers/SupplierAccount";

import Transactions from "../pages/other/Transactions";
import Analysis from "../pages/other/Analysis";

import NotFound from "../pages/Notfound";
import Demo from "../pages/Demo";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Landing Page Layout */}
      <Route
        path="/"
        element={
          <>
            <Navigation />

            <section id="home">
              <HeroSection />
            </section>
            <section id="features">
              <FeatureSection />
            </section>
            <section id="modules">
              <ModuleSection />
            </section>
            <section id="how-it-works">
              <HowItWorks />
            </section>
            <section id="comparison">
              <ComparisonSection />
            </section>

            <Footer />
          </>
        }
      />

      {/* Admin Dashboard (No Navigation / Footer) */}
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/login" element={<Login />}/>

      <Route path="/analysis" element={<Analysis />}/>
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/invoice-history" element={<InvoiceHistory />} />
      <Route path="/invoicepayment" element={<invoicePayment />} />
      <Route path="/invoicesummary" element={<invoiceSummaryModal />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/productsListView" element={<ProductListView />} />
      <Route path="/productSelection" element={<ProductSelectionModal />} />
      <Route path="/categoryManagement" element={<CategoryManagement />} />
      <Route path="/customerManagement" element={<CustomerManagement />} />
      <Route path="/addCustomer" element={<AddCustomer />} />
      <Route path="/supplierManagement" element={<SupplierManagement />} />
      <Route path="/supplierAccount" element={<SupplierAccount />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/quotation" element={<Quotation />} />
      <Route path="/quotationSummary" element={<QuotationSummery />} />
      <Route path="/quotationHistory" element={<QuotationHistory />} />
      <Route path="/grn" element={<GRN />} />
      <Route path="/purchase-order" element={<PurchaseOrder />} />
      <Route path="/purchase-order-history" element={<PurchaseOrderHistory />} />
      <Route path="/credit-note" element={<CreditNote />} />
      <Route path="/debit-note" element={<DebitNote />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;