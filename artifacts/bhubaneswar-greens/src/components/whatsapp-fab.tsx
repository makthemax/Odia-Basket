const PHONE = "917205203478";
const MESSAGE = "Namaskar! I want to place an order from Bhubaneswar Greens.";

export function WhatsAppFab() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp: +91 72052 03478"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 group"
    >
      <div className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white pl-3 pr-4 py-3 rounded-full shadow-lg shadow-green-500/30 transition-transform hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-6 w-6 fill-white"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.314.187-.658.187-1 0-.717-.86-1.118-1.418-1.39-.07-.034-.143-.07-.214-.115z" />
          <path d="M16.063 2.038C8.353 2.038 2.1 8.293 2.1 16.001c0 2.45.642 4.86 1.866 6.978L2 30l7.247-1.926a13.91 13.91 0 0 0 6.815 1.785h.006c7.71 0 13.963-6.255 13.963-13.962 0-3.731-1.452-7.236-4.092-9.876a13.917 13.917 0 0 0-9.876-3.983Zm0 25.582h-.005a11.59 11.59 0 0 1-5.91-1.617l-.424-.252-4.298 1.144 1.146-4.198-.276-.434a11.585 11.585 0 0 1-1.776-6.262c0-6.405 5.214-11.62 11.625-11.62 3.103 0 6.02 1.21 8.213 3.404a11.564 11.564 0 0 1 3.402 8.225c-.005 6.41-5.219 11.61-11.697 11.61Z" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </div>
    </a>
  );
}
