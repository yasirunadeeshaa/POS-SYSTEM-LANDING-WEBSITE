import { Routes, Route, Navigate } from "react-router-dom";

import HeroSection from "../pages/main/Herosection";
import FeatureSection from "../pages/main/Feature";
import Navigation from "../components/Navigation";
import ModuleSection from "../pages/main/ModuleSection";
import HowItWorks from "../pages/main/HowItWorks";
import Footer from "../components/Footer";
import NotFound from "../pages/Notfound";
import Analysis from "../pages/Analysis";
import Invoice from "../pages/sales/Invoice";
import AddProduct from "../pages/product/Addproduct";
import InvoiceHistory from "../pages/sales/InvoiceHistory";
import ComparisonSection from "../pages/main/Comparisonsection";
import ProductListView from "../pages/product/ProductListView";
import CategoryManagement from "../pages/CaregoryManagement";
import CustomerManagement from "../pages/customers/CustomerManagement";

import SupplierManagement from "../pages/suppliers/SupplierManagement";
import SupplierAccount from "../pages/suppliers/SupplierAccount";

import AdminDashboard from "../pages/dashboards/AdminDashboard";

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
      <Route path="/admin/dashboard" element={<AdminDashboard />}/>

      <Route path="/analysis" element={<Analysis />}/>
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/invoice-history" element={<InvoiceHistory />} />
      <Route path="/invoicepayment" element={<invoicePayment />} />
      <Route path="/invoicesummary" element={<invoiceSummaryModal />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/productsListView" element={<ProductListView />} />
      <Route path="/categoryManagement" element={<CategoryManagement />} />
      <Route path="/customerManagement" element={<CustomerManagement />} />
      <Route path="/supplierManagement" element={<SupplierManagement />} />
      <Route path="/supplierAccount" element={<SupplierAccount />} />
      <Route path="/demo" element={<Demo />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;