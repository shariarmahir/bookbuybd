const categories = [
  {
    title: 'Books for Him',
    subtitle: 'A different perspective on the world for men',
    bg: 'bg-sky-100',
    imgUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    textColor: 'text-sky-800',
  },
  {
    title: 'Holiday Specials',
    subtitle: 'Discover gifts from our BookStore',
    bg: 'bg-pink-100',
    imgUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    textColor: 'text-pink-800',
  },
  {
    title: 'Design Books',
    subtitle: 'Explore design inspiration at BookStore',
    bg: 'bg-brand-50',
    imgUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    textColor: 'text-brand-800',
  },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <a
            key={i}
            href="#"
            className={`relative rounded-xl overflow-hidden ${cat.bg} flex flex-col justify-end min-h-[160px] group cursor-pointer hover:shadow-lg transition`}
          >
            <img
              src={cat.imgUrl}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition"
            />
            <div className="relative z-10 p-4">
              <h3 className={`font-bold text-base ${cat.textColor}`}>{cat.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{cat.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}