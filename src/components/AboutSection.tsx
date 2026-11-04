import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

export const AboutSection: React.FC = () => {
  const reviews = [
    {
      name: 'Alhaji Ibrahim Bello',
      location: 'Nassarawa GRA, Kano',
      rating: 5,
      review:
        'Na samu gidan haya 4-bedroom duplex a Nassarawa GRA ta hannun Adam ba tare da wata matsala ba. Mutum ne mai gaskiya da amana, kuma takardun gidan babu wata shakka.',
      date: 'Oktoba 2026',
    },
    {
      name: 'Hajiya Amina Garba',
      location: 'Kantin Kwari, Kano',
      rating: 5,
      review:
        'Shagona na Kantin Kwari da na saya ta hanyar A.A Properties Kano shine mafi saurin ciniki da na taba yi. Daga binciken kotu har zuwa shaidar mallaka (C of O) komai ya tafi lafiya.',
      date: 'Satumba 2026',
    },
    {
      name: 'Dr. Kabiru Umar',
      location: 'Tarauni New Layout, Kano',
      rating: 5,
      review:
        'Free Inspection din da suka yi min a Tarauni ya tabbatar min da nagartarsu. Sun raka ni har sau biyu ba tare da sun nemi ko kwabo ba kafin na yanke shawara.',
      date: 'Agusta 2026',
    },
  ];

  return (
    <section id="about" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* CEO & Company Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: CEO Trust Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B3D2E] to-[#07261C] p-8 text-white relative shadow-xl border border-emerald-900">
              <div
                className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:16px_16px]"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-6">
                <BrandLogo size="lg" isLight={true} />

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                    Founder, CEO & Lead Consultant
                  </span>
                  <h3 className="text-2xl font-extrabold text-white font-['Poppins']">
                    Adam Auwal Adam
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    Kwararren Dillalin Filaye da Gidaje a Jihar Kano
                  </p>
                </div>

                <blockquote className="text-xs sm:text-sm text-emerald-100/90 italic leading-relaxed pt-2 border-t border-emerald-800/80">
                  "Manufar A.A Properties Kano ita ce kawo karshen damfara a harkar filaye da gidaje a Kano. Kowace takarda da muka bayar ta C of O ko R of O halal ce kuma an tantance ta a ma'aikatar filaye."
                </blockquote>

                {/* Direct Contact Action */}
                <div className="pt-4 border-t border-emerald-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <Phone className="w-4 h-4 text-[#C9A227]" />
                    <span className="font-bold text-white">09042782681</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200">
                    <Mail className="w-4 h-4 text-[#C9A227]" />
                    <span>aapropertieskano@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                    <span>Murtala Mohammed Way, Kano</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/2349042782681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-[#0B3D2E]" />
                  <span>TATTAUNA DA ADAM A WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Values, Pillars, and Numbers */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E]">
                Game da A.A Properties Kano
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins'] mt-1 leading-snug">
                Gida, Fili, Shago, Company - Haya da Saya - Gaskiya da Aminci
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mt-3">
                Tun daga shekarar 2022, kamfanin A.A Properties Kano karkashin jagorancin Malam Adam Auwal Adam ya zama kan gaba wajen taimaka wa dubban jama'a samun gidajen haya, filayen gini, da shagunan kasuwanci a dukkan unguwannin birnin Kano da kewayenta.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-[#0B3D2E] mb-2" />
                <h4 className="text-xs font-bold text-slate-900 font-['Poppins']">
                  Binciken Takardu (100% Legal)
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                  Babu siyar da fili ba tare da C of O ko R of O mai inganci ba.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-[#C9A227] mb-2" />
                <h4 className="text-xs font-bold text-slate-900 font-['Poppins']">
                  FREE Physical Inspection
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                  Kowane abokin ciniki yana da damar zuwa duba kaya kyauta kafin kulla yarjejeniya.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Award className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 font-['Poppins']">
                  Gaskiya da Saukin Haya
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                  Hanyoyin ciniki na gaskiya tsakanin mai gida da dan haya ba tare da kudin boye ba.
                </p>
              </div>
            </div>

            {/* Kano Areas Covered Tagcloud */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-['Poppins']">
                Unguwannin da Muke Aiki a Kano:
              </h4>
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Sabon Gari</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Nassarawa GRA</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Tarauni</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Fagge</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Gwale</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Kantin Kwari</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Hotoro</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Zoo Road</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Janguza</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Rijiyar Zaki</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Murtala Mohammed Way</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Sharada</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Bompai</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">Airport Road</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Testimonials Section */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1 text-[#C9A227] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C9A227]" />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Poppins']">
              Ra'ayoyin Abokan Cinikinmu a Kano
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bita 347 daga abokan cinikin da suka yi haya ko suka sayi fili ta hannun Adam Auwal Adam (4.8/5.0).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C9A227]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C9A227]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{rev.name}</p>
                    <p className="text-[11px] text-slate-500">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
