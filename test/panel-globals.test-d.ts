// Tests the opt-in `kirby-types/panel-globals` augmentation.
import type { Panel } from "../src/panel";
import { expectType } from "tsd";
import { defineComponent } from "vue";
import "../panel-globals";

expectType<Panel>(window.panel);

defineComponent({
  mounted() {
    expectType<Panel>(this.$panel);
    expectType<string>(this.$t("save"));
  },
});
