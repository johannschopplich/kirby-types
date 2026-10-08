// Tests the opt-in `kirby-types/panel-globals` augmentation. Runs in its own tsd
// program, since the augmentation would reach every other test file.
import type { Panel } from "../src/panel";
import { expectType } from "tsd";
import { defineComponent } from "vue";
import "../panel-globals";

expectType<Panel>(window.panel);

defineComponent({
  mounted() {
    expectType<Panel>(this.$panel);
  },
});
