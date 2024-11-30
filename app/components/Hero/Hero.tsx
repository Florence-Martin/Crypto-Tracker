export default function Hero() {
  return (
    <section className="bg-gray-700 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to Crypto Tracker
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Track popular cryptocurrencies and manage your portfolio seamlessly.
        </p>
        <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors">
          Get Started
        </button>
      </div>
    </section>
  );
}
