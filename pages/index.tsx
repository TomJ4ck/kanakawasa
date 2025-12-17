import React from 'react';
import Head from 'next/head';
import { InputForm } from '../components/InputForm';
import { ResultsCard } from '../components/ResultsCard';

export default function Home() {
  return (
    <>
      <Head>
        <title>令和7年(2025) 神奈川県 社会保険料計算ツール</title>
        <meta name="description" content="神奈川県の社会保険料を計算するツール" />
      </Head>
      
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 animate-fade-in-up">
          <div className="sticky top-24 space-y-6">
            <InputForm />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7" id="result-section">
          <ResultsCard />
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-8 text-center text-xs text-[#747775] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <p className="font-medium">免責事項</p>
        <p className="mt-1 max-w-2xl mx-auto">
          この計算ツールが提供するすべてのデータは、公開されている令和7年(2025年)の税率および保険料率表に基づく概算値です。計算結果は、財務上または法律上の助言を構成するものではありません。実際の控除額は、個々の状況（他の収入、特別な控除など）によって異なる場合があります。最終的な金額については、公式の給与明細書をご確認ください。
        </p>
      </div>
    </>
  );
}
