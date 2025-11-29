declare module 'html2pdf.js' {
    function html2pdf(): {
        from: (element: HTMLElement) => {
            set: (opt: any) => {
                save: () => Promise<void>;
            };
            save: () => Promise<void>;
        };
    };
    export default html2pdf;
}