import { FireworksEngine } from "../../utils/fireworks-engine";

Component({
  properties: {
    visible: { type: Boolean, value: false },
  },

  observers: {
    visible(newVal) {
      if (newVal) {
        this._initFireworks();
      }
    },
  },

  methods: {
    _initFireworks() {
      this._stop();
      const query = this.createSelectorQuery();
      query.select("#fireworksCanvas").fields({ node: true, size: true }, (res) => {
        if (!res) return;
        const canvas = res.node;
        const ctx = canvas.getContext("2d");
        const dpr = wx.getWindowInfo().pixelRatio;
        canvas.width = res.width * dpr;
        canvas.height = res.height * dpr;
        ctx.scale(dpr, dpr);
        this._fw = new FireworksEngine(ctx, res.width, res.height, () => {
          this.setData({ visible: false });
          this._fw = null;
        });
        this._fw.trigger();
      }).exec();
    },

    _stop() {
      if (this._fw) {
        this._fw.stop();
        this._fw = null;
      }
    },
  },

  _fw: null,
});
