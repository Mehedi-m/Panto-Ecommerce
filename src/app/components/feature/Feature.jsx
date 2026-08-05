export default function Feature() {
  return (
    <section className="bg-white text-black py-20 px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
        <h2 className="text-3xl font-bold">
          Why <br /> Choosing Us
        </h2>

        <div>
          <h3 className="font-semibold text-lg">
            Luxury facilities
          </h3>

          <p className="text-gray-500 mt-2">
            We provide premium quality furniture with modern design for your comfort.
          </p>
           <button className="mt-8 text-orange-500 font-medium hover:translate-x-2 transition-transform duration-300">
              More Info →
            </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Affordable Price
          </h3>

          <p className="text-gray-500 mt-2">
            Get high-quality furniture at the best and most affordable prices.
          </p>
           <button className="mt-8 text-orange-500 font-medium hover:translate-x-2 transition-transform duration-300">
              More Info →
            </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Many Choices
          </h3>

          <p className="text-gray-500 mt-2">
            A wide variety of styles and designs for every type of home interior.
          </p>
           <button className="mt-8 text-orange-500 font-medium hover:translate-x-2 transition-transform duration-300">
              More Info →
            </button>
        </div>
      </div>
    </section>
  );
}