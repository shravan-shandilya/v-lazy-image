const VuetifyLazyImageComponent = {
  props: {
    src: {
      type: String,
      required: true
    },
    srcPlaceholder: {
      type: String,
      default: ""
    },
    aspectRatio: {
      type: Number,
      default: 1.777
    }
  },
  data: () => ({
    observer: null,
    intersected: false,
    loaded: false
  }),
  computed: {
    srcImage() {
      return this.intersected ? this.src : this.srcPlaceholder;
    }
  },
  methods: {
    load() {
      if (this.$el.getAttribute("src") !== this.srcPlaceholder) {
        this.loaded = true;
        this.$emit("load");
      }
    }
  },
  render(h) {
    return h("v-img", {
      attrs: {
        src: this.srcImage,
        "aspect-ratio": this.aspectRatio
      },
      class: {
        "vuetify-lazy-image": true,
        "vuetify-lazy-image-loaded": this.loaded
      },
      on: { load: this.load }
    });
  },
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
        this.$emit("intersect");
      }
    }, {});

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  }
};

export default VuetifyLazyImageComponent;

export const VuetifyLazyImagePlugin = {
  install: (Vue, opts) => {
    Vue.component("VuetifyLazyImage", VuetifyLazyImageComponent);
  }
};
