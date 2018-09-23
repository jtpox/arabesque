<template>
  <b-container 
    fluid 
    class="shinpuru-container">
    <b-row>
      <b-col>
        <ul class="shinpuru-tools">
          <li>
            <a 
              v-b-tooltip.hover 
              href="#" 
              title="Toggle Preview" 
              @click.prevent="togglePreview"><i class="fas fa-eye"/></a>
          </li>
          <li 
            v-for="(data, key) in markdown" 
            :key="key">
            <a 
              v-b-tooltip.hover 
              :title="data.name" 
              href="#" 
              @click.prevent="modifyText(key)" 
              v-html="data.icon"/>
          </li>
        </ul>
      </b-col>

      <b-col md="11">
        <textarea 
          v-show="visible.input" 
          id="shinpuru-input" 
          :value="value" 
          class="shinpuru-input" 
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
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Showdown from "showdown";
import Marked from "marked";
import Turndown from "turndown";

export default {
  name: "Shinpuru",
  props: {
    value: String
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
          icon: '<i class="fas fa-bold"></i>',
          template: "__{SELTEXT}__"
        },
        italic: {
          name: "Italic",
          icon: '<i class="fas fa-italic"></i>',
          template: "*{SELTEXT}*"
        },
        strikethrough: {
          name: "Strikethrough",
          icon: '<i class="fas fa-strikethrough"></i>',
          template: "~~{SELTEXT}~~"
        },

        link: {
          name: "Link",
          icon: '<i class="fas fa-link"></i>',
          template: "[{SELTEXT}](http://)"
        },
        image: {
          name: "Image",
          icon: '<i class="fas fa-image"></i>',
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
<style>
.shinpuru-input,
.shinpuru-display {
  width: 100%;
  height: auto;
}
.shinpuru-input {
  min-height: 300px;
  resize: none;
  overflow: hidden;
  /* Margin & Padding */
  padding: 10px;
  /* Border */
  border: 1px solid #e6e9ed;
  /* Border Radius */
  border-radius: 6px;
}

.shinpuru-display {
  background-color: #f5f4fa;
}

.shinpuru-container {
  width: 100%;
  height: auto;
  min-height: 100%;
  max-height: 100%;
  /* Margin & Padding */
  padding: 0;
  /* Font */
  font-family: "Merriweather", serif;
  /* Position */
  position: relative;
}

.shinpuru-tools {
  list-style: none;
  /* Text */
  text-align: center;
  /* Margin & Padding */
  margin: 0;
  padding: 0;
  /* Position */
  position: sticky;
  top: 10px;
  left: 10px;
  /* Border */
  border: 1px solid #e6e9ed;
  /* Border Radius */
  border-radius: 6px;
}
.shinpuru-tools > li {
  /* Margin * Padding */
  margin: 0;
  padding: 0;
  /* Border */
  border-top: 1px solid #e6e9ed;
}

.shinpuru-tools > li:first-child {
  /* Border */
  border-top: none;
}

.shinpuru-tools > li > a {
  display: block;
  /* FOnt */
  color: #434a54;
  /* Margin & Padding */
  padding: 10px;
}

.shinpuru-tools > li > a:hover {
  background-color: #e6e9ed;
}
</style>
