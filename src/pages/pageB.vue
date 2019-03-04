<template>
  <div>页面b被加载</div>
</template>
<script>
export default {
  name:'pageB',
  mounted(){
    setTimeout(()=>{
      this.$store.dispatch('incrementAAction')
      console.log('pageb store dispatch结果', this.$store.state.count,this.$store.state.b.count);
    },10000)
  }
}
</script>
<style>

</style>


