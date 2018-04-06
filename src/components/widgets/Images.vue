<template>
    <b-modal hide-footer size="lg" ref="imagesWidget" id="imagesWidget" title="Select Image">
        <div class="row">
            <div class="col-md-3">
                <button type="button" class="btn btn-default btn-lg btn-block" v-on:click="selectImage(null)">None</button>
            </div>

            <div class="col-md-3" v-for="(image, index) in images" :key="image._id">
                <img :src="'/uploads/images/' + image.file_name" class="img-fluid rounded border" v-on:click="selectImage(index)" />
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'ImagesWidget',
    data() {
        return{
            images: []
        }
    },
    created() {
        this.getImages()
    },
    methods: {
        getImages() {
            this.axios.get(this.api + '/images').then((res) => {
                this.images = res.data;
            })
            .catch((err) => {
                console.log(err)
            })
        },
        selectImage(index) {
            if (index == null)
            {
                this.$store.commit('clearSelectedImage')
            }
            else
            {
                this.$store.commit('selectImage', this.images[index])
            }

            //Hide Modal.
            this.$refs.imagesWidget.hide()
        }
    }
}
</script>