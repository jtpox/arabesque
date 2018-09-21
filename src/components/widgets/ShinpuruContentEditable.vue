<template>
    <b-container fluid class="shinpuru-container">
        <b-row>
            <b-col>
                <ul class="shinpuru-tools">
                    <li>
                        <a href="#" title="Toggle Preview" v-on:click.prevent="togglePreview" v-b-tooltip.hover><i class="fas fa-eye"></i></a>
                    </li>
                    <li v-for="(data, key) in markdown" v-bind:key="key">
                        <a href="#" :title="data.name" v-html="data.icon" v-on:click.prevent="modifyText(key)" v-b-tooltip.hover></a>
                    </li>
                </ul>
            </b-col>

            <b-col md="11">
                <div class="shinpuru-input" id="shinpuru-input" contenteditable="true" v-show="visible.input" @blur="change($event.target)" v-html="live"></div>
                <div class="shinpuru-display" v-html="marked" v-show="visible.display"></div>
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
/*
 * This is just a test! I have no plans to finish this.
 */
import Showdown from 'showdown';
import Marked from 'marked';
import Turndown from 'turndown';

export default {
    name: 'shinpuru',
    props: {
        value: String,
    },
    data() {
        return {
            editor: null,
            visible: {
                display: false,
                input: true,
            },
            markdown: {
                /* heading: {
                    name: 'Heading',
                    icon: '<i class="fas fa-heading"></i>',
                    template: '# {SELTEXT}',
                    find: '',
                    replace: ''
                }, */
                bold: {
                    name: 'Bold',
                    icon: '<i class="fas fa-bold"></i>',
                    template: '__{SELTEXT}__',
                    find: /(\*\*|__)(.*?)\1/g,
                    replace: '__<strong>$2</strong>__',
                },
                italic: {
                    name: 'Italic',
                    icon: '<i class="fas fa-italic"></i>',
                    template: '*{SELTEXT}*',
                    find: /(\*|_)(.*?)\1/g,
                    replace: '*<em>$2</em>*',
                },
                strikethrough: {
                    name: 'Strikethrough',
                    icon: '<i class="fas fa-strikethrough"></i>',
                    template: '~~{SELTEXT}~~',
                    find: '/\~\~(.*?)\~\~/g',
                    replace: '<del>$1</del>',
                },

                link: {
                    name: 'Link',
                    icon: '<i class="fas fa-link"></i>',
                    template: '[{SELTEXT}](http://)',
                    find: /\[([^\[]+)\]\(([^\)]+)\)/g,
                    replace: '<a href="$2" target="_blank">[$1]($2)</a>',
                },
                image: {
                    name: 'Image',
                    icon: '<i class="fas fa-image"></i>',
                    template: '![{SELTEXT}](http://)',
                    find: '',
                    replace: '',
                },
            },
        }
    },
    mounted() {
        // this.$el.getElementsByClassName('shinpuru-input')[0].innerHTML = this.liveText(this.value);
        // this.$el.getElementsByClassName('shinpuru-input')[0].innerHTML = this.liveText();
    },
    computed: {
        marked() {
            // console.log(Marked(this.value));
            if (this.value) return Marked(this.value);
        },
        live() {
            // console.log(this.content);
            if (this.value) {
                console.log(this.value);
                let replacement = this.value;
                for (var mark in this.markdown) {
                    replacement = replacement.replace(this.markdown[mark].find, this.markdown[mark].replace);
                    // console.log(replacement);
                }
                replacement = ('\n' + replacement + '\n').replace(/\n([^\n]+)/g, '\n\n<p>$1</p>\n\n');
                console.log(replacement);
                return replacement;
            }
        },
        wordCount() {
            // if(this.value) return this.value.split(' ').length;
            if (this.value) {
                return this.value.split(' ').length; 
            } else {
                return 0;
            }
        }
    },
    watch: {
        /*value() {
            console.log(this.value);
            this.$el.getElementsByClassName('shinpuru-input')[0].innerHTML = this.liveText();
            return this.liveText();
        }*/
    },
    methods: {
        /*liveText() {
            if (this.value) {
                let replacement = this.value;
                for (var mark in this.markdown) {
                    replacement = replacement.replace(this.markdown[mark].find, this.markdown[mark].replace);
                    // console.log(replacement);
                }
                console.log(replacement);
                return replacement;
            }
        },*/
        change(target) {
            // this.input.style.height = (this.input.scrollHeight) + 'px';
            // this.updateHeight(target);
            // console.log(target.innerText);
            // this.$el.getElementsByClassName('shinpuru-input')[0].innerHTML = this.liveText(this.value);
            // this.content = target.innerText;
            this.$emit('input', target.innerText);
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
            console.log(window.getSelection().anchorOffset);
            const input = document.getElementById('shinpuru-input');
            const start = input.selectionStart;
            const end   = input.selectionEnd;
            const selected = input.value.substring(start, end);
            // console.log(`Start: ${start} | End: ${end} | Selected: ${selected} | End`);

            let replacement = '';
            switch(type) {
                case "bold":
                replacement = this.replace(this.markdown.bold.template, selected);
                break;

                case "italic":
                replacement = this.replace(this.markdown.italic.template, selected);
                break;

                case "strikethrough":
                replacement = this.replace(this.markdown.strikethrough.template, selected);
                break;

                case "image":
                replacement = this.replace(this.markdown.image.template, (selected === "")? 'Alt Text' : selected);
                break;

                case "link":
                replacement = this.replace(this.markdown.link.template, (selected === "")? 'Link Text' : selected);
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
.shinpuru-input, .shinpuru-display {
    width: 100%;
    height: auto;
}
.shinpuru-input {
    min-height: 500px;
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
    font-family: 'Merriweather', serif;
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
    top: 0;
    left: 0;
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