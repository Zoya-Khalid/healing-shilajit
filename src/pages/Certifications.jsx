import React from "react";
import { Shield, FileText, Download, CheckCircle, Award, Eye } from "lucide-react";

export default function Certifications() {
  const reports = [
    {
      id: "PCSIR-0462",
      title: "Purity & Mineral Analysis",
      date: "September 2025",
      image: "/images/certifications/pcsir-report-1.jpg",
      description: "Comprehensive test confirming 60% Fulvic Acid content and high Humic Acid levels.",
      lab: "PCSIR Laboratories Islamabad"
    },
    {
      id: "PCSIR-0364",
      title: "Microbiological Safety Test",
      date: "August 2025",
      image: "/images/certifications/pcsir-report-2.jpg",
      description: "Safety screening for Coliforms, E.coli, and other pathogens. Result: Absent/Safe.",
      lab: "PCSIR Laboratories Islamabad"
    },
    {
      id: "PCSIR-0460",
      title: "Heavy Metals & Chemical Analysis",
      date: "September 2025",
      image: "/images/certifications/pcsir-report-3.jpg",
      description: "Testing for Lead, Arsenic, Mercury, and Cadmium. All levels verified within safe limits.",
      lab: "PCSIR Laboratories Islamabad"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-black text-white rounded-b-[3rem] max-md:!pt-[100px] max-md:!pb-[40px] max-md:!rounded-b-[20px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-3 bg-amber-500/10 rounded-2xl mb-6 max-md:!mb-4">
            <Shield className="h-10 w-10 text-amber-500 max-md:!h-8 max-md:!w-8" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 max-md:!text-[32px] max-md:!mb-4">
            Our <span className="text-amber-500">Certifications</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed max-md:!text-[14px] max-md:!leading-[1.6]">
            At Herbveda, transparency is our priority. Every batch of our Himalayan Shilajit is rigorously tested by the Pakistan Council of Scientific & Industrial Research (PCSIR) to ensure 100% purity, safety, and potency.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-md:!py-[40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-md:!gap-6">
            {reports.map((report, index) => (
              <div key={index} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 max-md:!rounded-3xl">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img 
                    src={report.image} 
                    alt={report.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x800?text=Lab+Report+Coming+Soon";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => window.open(report.image, '_blank')}
                      className="p-4 bg-white rounded-full text-black hover:bg-amber-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                      <Eye className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8 max-md:!p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest text-amber-600 uppercase bg-amber-50 rounded-full px-4 py-1">
                      {report.id}
                    </span>
                    <span className="text-sm text-gray-400">{report.date}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-gray-900 max-md:!text-[18px]">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 max-md:!text-[13px] max-md:!mb-4">
                    {report.description}
                  </p>
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      Issued by: {report.lab}
                    </span>
                    <button 
                      onClick={() => window.open(report.image, '_blank')}
                      className="flex items-center gap-2 text-sm font-bold text-black hover:text-amber-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      View Full
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-20 p-10 bg-black text-white rounded-[3rem] text-center max-md:!mt-10 max-md:!p-6 max-md:!rounded-[20px]">
            <h4 className="text-2xl font-serif font-bold mb-4 max-md:!text-[18px]">Need a specific batch report?</h4>
            <p className="text-gray-400 mb-8 max-md:!text-[13px] max-md:!mb-6">
              If you have recently purchased Herbveda Shilajit and would like the specific lab report for your batch number, please contact our support team.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-amber-500 text-black px-10 py-4 rounded-full font-bold hover:bg-amber-400 transition-all max-md:!px-6 max-md:!py-3 max-md:!text-[14px]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
