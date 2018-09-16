<template>
    <b-container fluid class="shimpuru-container">
        <b-row>
            <b-col>
                <ul class="shimpuru-tools">
                    <li><b-button block variant="secondary" title="Toggle Preview" v-on:click.prevent="togglePreview" v-b-tooltip.hover><i class="fas fa-eye"></i></b-button></li>
                    <li><b-button block variant="primary" title="Bold" v-on:click.prevent="modifyText('bold')" v-b-tooltip.hover><i class="fas fa-bold"></i></b-button></li>
                    <li><b-button block variant="primary" title="Italic" v-on:click.prevent="modifyText('italic')" v-b-tooltip.hover><i class="fas fa-italic"></i></b-button></li>
                    <li><b-button block variant="primary" title="Strikethrough" v-on:click.prevent="modifyText('strikethrough')" v-b-tooltip.hover><i class="fas fa-strikethrough"></i></b-button></li>

                    <li><b-button block variant="success" title="Image" v-on:click.prevent="modifyText('image')" v-b-tooltip.hover><i class="fas fa-image"></i></b-button></li>
                    <li><b-button block variant="success" title="Link" v-on:click.prevent="modifyText('link')" v-b-tooltip.hover><i class="fas fa-link"></i></b-button></li>
                </ul>
            </b-col>

            <b-col md="11">
                <textarea class="shimpuru-input" id="shimpuru-input" @input="change($event.target)" @focus="updateHeight($event.target)" :value="value" v-show="visible.input"></textarea>
                <div class="shimpuru-display" v-html="marked" v-show="visible.display"></div>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import Showdown from 'showdown';
import Marked from 'marked';
import Turndown from 'turndown';

export default {
    name: 'Shimpuru',
    props: {
        value: String,
    },
    data() {
        return {
            visible: {
                display: false,
                input: true,
            },
            markdown: {
                bold: '__{SELTEXT}__',
                italic: '*{SELTEXT}*',
                strikethrough: '~~{SELTEXT}~~',

                link: '[{SELTEXT}](https://)',
                image: '![{SELTEXT}](http://)',
            }
        }
    },
    mounted() {
        document.getElementById('shimpuru-input').addEventListener('change', function() {
            this.$emit('input', this.value);
        }.bind(this));

        window.addEventListener('mouseup', this.stopTrack);
    },
    computed: {
        marked() {
            if (this.value) return Marked(this.value);
        }
    },
    methods: {
        change(target) {
            // this.input.style.height = (this.input.scrollHeight) + 'px';
            this.updateHeight(target);
            this.$emit('input', target.value);
        },
        updateHeight(target) {
            target.style.height = '5px';
            target.style.height = target.scrollHeight + 'px';
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
            const input = document.getElementById('shimpuru-input');
            const start = input.selectionStart;
            const end   = input.selectionEnd;
            const selected = input.value.substring(start, end);
            // console.log(`Start: ${start} | End: ${end} | Selected: ${selected} | End`);

            let replacement = '';
            switch(type) {
                case "bold":
                replacement = this.replace(this.markdown.bold, selected);
                break;

                case "italic":
                replacement = this.replace(this.markdown.italic, selected);
                break;

                case "strikethrough":
                replacement = this.replace(this.markdown.strikethrough, selected);
                break;

                case "image":
                replacement = this.replace(this.markdown.image, (selected === "")? 'Alt Text' : selected);
                break;

                case "link":
                replacement = this.replace(this.markdown.link, (selected === "")? 'Link Text' : selected);
                break;
            }
            // console.log(`Replacement: ${replacement} | ${input.value.length}`);
            const final = input.value.substring(0, start) + replacement + input.value.substring(end, input.value.length);
            // console.log('Test: ' + final);
            this.$emit('input', final);
            // this.$emit('input', input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length));
            // this.$emit('input', input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length));
            // input.value = input.value.substring(0, start) + replacement + input.value.substring(start, input.value.length);
            // console.log(input.value);
        },
        replace(template, string) {
            return template.replace(/{SELTEXT}/g, string);
        },
    },
}
</script>
<style>
.shimpuru-input, .shimpuru-display {
    width: 100%;
    height: auto;
}
.shimpuru-input {
    min-height: 500px;
    resize: none;
    overflow: hidden;
    /* Margin & Padding */
    padding: 0;
    /* Border */
    border: 0;
}

.shimpuru-display {
    background-color: #f5f4fa;
}

.shimpuru-container {
    width: 100%;
    height: auto;
    min-height: 100%;
    max-height: 100%;
    /* Font */
    font-family: 'Merriweather', serif;
    /* Position */
    position: relative;
}

.shimpuru-tools {
    list-style: none;
    /* Margin & Padding */
    margin: 0;
    padding: 10px;
    /* Position */
    position: sticky;
    top: 0;
    left: 0;
}
.shimpuru-tools > li {
    /* Margin & Padding */
    padding: 5px 0 5px 0;
}
</style>