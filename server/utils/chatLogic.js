/** Keyword-based multilingual mock assistant */

const RESPONSES = {
  en: [
    { keys: ['best crop', 'which crop', 'black soil'], text: 'On black soil (vertisols), cotton, soybean, and tur often perform well. Run a simulation with your rainfall & budget for a ranked plan.' },
    { keys: ['medicine', 'leaf spot', 'fung'], text: 'Leaf spots may be fungal or bacterial. Upload a clear leaf photo in Disease Detection for medicine names, dosage, and nearby stores.' },
    { keys: ['irrigat', 'water', 'cotton'], text: 'Cotton is sensitive to water stress during flowering. Prefer light frequent irrigations; our Irrigation Planner can draft a weekly schedule.' },
    { keys: ['sell', 'maize', 'market'], text: 'Check Market Intelligence for mandi-style trend lines. If next-month price is rising, holding (with storage risk) can help — we show Buy/Hold/Sell hints.' },
    { keys: ['scheme', 'subsidy', 'pm kisan'], text: 'Open Schemes & Subsidy Finder — enter your state, land size, and category to see PM-KISAN, PMFBY, drip subsidy, and more.' },
    { keys: ['pest', 'bollworm', 'worm'], text: 'Humid weather raises lepidopteran risk. Use Pest Alerts for a mock risk score and prevention checklist before spraying.' },
    { keys: ['telugu', 'hindi', 'language'], text: 'Voice & full UI translations are rolling out — Settings already supports Telugu/Hindi labels; ask short questions here anytime.' },
  ],
  hi: [
    { keys: ['फसल', 'soil', 'मिट्टी'], text: 'काली मिट्टी में कपास, सोयाबीन अच्छी चुनाव हो सकती हैं। सिमुलेशन चलाकर लाभ और जोखिम देखें।' },
    { keys: ['दवा', 'medicine', 'पत्त'], text: 'पत्तियों के धब्बों के लिए Disease Detection में फोटो अपलोड करें — दवा और खुराक मिलेगी।' },
  ],
  te: [
    { keys: ['పంట', 'soil', 'నేల'], text: 'నల్లని నేలలో పత్తి, సోయాబీన్ మంచి ఎంపిక కావచ్చు। సిమ్యులేషన్‌తో లాభాన్ని పోల్చండి।' },
    { keys: ['మందు', 'medicine', 'ఆక'], text: 'ఆకు ఫోటోను Disease Detectionలో అప్‌లోడ్ చేయండి — మందులు, మోతాదు, దుకాణాలు చూపిస్తాము।' },
  ],
};

function pick(lang, msg) {
  const m = msg.toLowerCase();
  const buckets = [...(RESPONSES[lang] || []), ...RESPONSES.en];
  for (const row of buckets) {
    if (row.keys.some((k) => m.includes(k))) return row.text;
  }
  return lang === 'hi'
    ? 'मैं आपका स्मार्ट फार्म सहायक हूँ। सिमुलेशन, बाजार, सिंचाई, योजना या रोग के बारे में संक्षिप्त प्रश्न पूछें।'
    : lang === 'te'
      ? 'నేను మీ స్మార్ట్ ఫార్మ్ సహాయకుడిని. సిమ్యులేషన్, మార్కెట్, త్రాగునీరు, పథకాలు లేదా వ్యాధి గురించి చిన్న ప్రశ్న అడగండి.'
      : 'I am your Smart Farm assistant. Ask about simulations, market prices, irrigation plans, schemes, pests, or disease photo checks — keep questions short for best mock answers.';
}

export function chatReplyMock(message, lang = 'en') {
  const code = ['te', 'hi'].includes(lang) ? lang : 'en';
  return pick(code, message);
}
