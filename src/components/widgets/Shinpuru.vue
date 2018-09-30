<template>
  <div
    class="shinpuru-container">
    <div
      class="tools-container">
      <ul class="shinpuru-tools">
        <li>
          <a 
            v-b-tooltip.hover 
            href="#" 
            title="Toggle Preview" 
            @click.prevent="togglePreview"><font-awesome-icon icon="eye" /></a>
        </li>
        <li 
          v-for="(data, key) in markdown" 
          :key="key">
          <a 
            v-b-tooltip.hover 
            :title="data.name" 
            href="#" 
            @click.prevent="modifyText(key)">
            <font-awesome-icon :icon="['fas', data.icon]" />
          </a>
        </li>
      </ul>
    </div>

    <div
      class="input-container">
      <textarea 
        v-show="visible.input" 
        id="shinpuru-input" 
        :value="value" 
        class="form-control shinpuru-input" 
        placeholder="Write your story here." 
        @input="change($event.target)" 
        @focus="updateHeight($event.target)"/>
      <div 
        v-show="visible.display" 
        class="shinpuru-display" 
        v-html="marked"/>
      <div class="text-right">
        <p>
          <small>Words: {{ wordCount }}</small>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Showdown from "showdown";
import Marked from "marked";
import Turndown from "turndown";

export default {
  name: "Shinpuru",
  props: {
    value: {
      type: String,
      default: "",
      required: false
    }
  },
  data() {
    return {
      visible: {
        display: false,
        input: true
      },
      markdown: {
        bold: {
          name: "Bold",
          icon: "bold",
          template: "__{SELTEXT}__"
        },
        italic: {
          name: "Italic",
          icon: "italic",
          template: "*{SELTEXT}*"
        },
        strikethrough: {
          name: "Strikethrough",
          icon: "strikethrough",
          template: "~~{SELTEXT}~~"
        },

        link: {
          name: "Link",
          icon: "link",
          template: "[{SELTEXT}](http://)"
        },
        image: {
          name: "Image",
          icon: "image",
          template: "![{SELTEXT}](http://)"
        }
      }
    };
  },
  computed: {
    marked() {
      if (this.value) return Marked(this.value);
    },
    wordCount() {
      if (this.value) {
        return this.value.trim().split(/\s+/).length;
      }
      return 0;
    }
  },
  mounted() {
    document.getElementById("shinpuru-input").addEventListener("change", () => {
      this.$emit("input", this.value);
    });
  },
  methods: {
    change(target) {
      // this.input.style.height = (this.input.scrollHeight) + 'px';
      this.updateHeight(target);
      this.$emit("input", target.value);
    },
    updateHeight(target) {
      target.style.height = "5px";
      target.style.height = `${target.scrollHeight}px`;
    },
    togglePreview() {
      if (this.visible.display) {
        this.visible.display = false;
        this.visible.input = true;
      } else {
        this.visible.display = true;
        this.visible.input = false;
      }
    },
    modifyText(type) {
      const input = document.getElementById("shinpuru-input");
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const selected = input.value.substring(start, end);
      // console.log(`Start: ${start} | End: ${end} | Selected: ${selected} | End`);

      let replacement = "";
      switch (type) {
        case "bold":
          replacement = this.replace(this.markdown.bold.template, selected);
          break;

        case "italic":
          replacement = this.replace(this.markdown.italic.template, selected);
          break;

        case "strikethrough":
          replacement = this.replace(
            this.markdown.strikethrough.template,
            selected
          );
          break;

        case "image":
          replacement = this.replace(
            this.markdown.image.template,
            selected === "" ? "Alt Text" : selected
          );
          break;

        case "link":
          replacement = this.replace(
            this.markdown.link.template,
            selected === "" ? "Link Text" : selected
          );
          break;
      }
      // console.log(`Replacement: ${replacement} | ${input.value.length}`);
      const final =
        input.value.substring(0, start) +
        replacement +
        input.value.substring(end, input.value.length);
      // console.log('Test: ' + final);
      this.$emit("input", final);
      // this.$emit('input', input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length));
      // this.$emit('input', input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length));
      // input.value = input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length);
      // console.log(input.value);
    },
    replace(template, string) {
      return template.replace(/{SELTEXT}/g, string);
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/shinpuru";
</style>
