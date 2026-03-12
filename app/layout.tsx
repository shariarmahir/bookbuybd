import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';

export const metadata: Metadata = {
  title: 'BookBuyBD - Your Trusted Online Bookstore in Dhaka',
  description: 'Shop books online from Nilkhet, Dhaka. Wide collection of fiction, non-fiction, and academic books at affordable prices.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body>
        <Script id="strip-fdprocessedid" strategy="beforeInteractive">
          {`(function () {
  var ATTR = 'fdprocessedid';

  function strip(root) {
    if (!root) return;

    if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute(ATTR)) {
      root.removeAttribute(ATTR);
    }

    if (root.querySelectorAll) {
      var nodes = root.querySelectorAll('[' + ATTR + ']');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute(ATTR);
      }
    }
  }

  strip(document.documentElement);

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'attributes' && mutation.attributeName === ATTR) {
        mutation.target.removeAttribute(ATTR);
      }

      var addedNodes = mutation.addedNodes;
      for (var j = 0; j < addedNodes.length; j++) {
        strip(addedNodes[j]);
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [ATTR],
  });

  window.addEventListener('load', function () {
    setTimeout(function () {
      observer.disconnect();
    }, 5000);
  });
})();`}
        </Script>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
