declare module '@qiun/ucharts' {
  class UCharts {
    constructor(opts: any);
    touchLegend: (e: any) => void;
    showToolTip: (e: any) => void;
    updateData: (data: any) => void;
  }
  export default UCharts;
} 