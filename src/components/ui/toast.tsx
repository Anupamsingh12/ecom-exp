'use client';

import * as Toast from '@radix-ui/react-toast';
import { useState, useEffect } from 'react';

export default function AutoDismissToast() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Show Toast
      </button>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow"
        >
          <Toast.Title>This toast disappears after 2 seconds!</Toast.Title>
        </Toast.Root>

        <Toast.Viewport />
      </Toast.Provider>
    </>
  );
}
