export default function Modal({ open, onclose, children }) {
  return (
    <>
      <div
        onClick={onclose}
        className={`fixed flex justify-center items-center inset-0 transition-colors z-[100]
                     ${open ? "visible bg-black/40" : "invisible"}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-[rgba(249,247,247)] rounded-xl shadow p-6 transition-all 
            /* Mobile styles */
            h-[37vh] w-[95vw] mx-4
            /* Tablet styles */
            md:h-2/5 md:w-4/5
            /* Desktop styles */
            lg:h-2/5 lg:w-3/5
            /* Large desktop */
            xl:max-w-2xl xl:max-h-[600px]
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
