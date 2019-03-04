<template>
  <div>页面a被加载</div>
</template>
<script>
export default {
  name:'pageA',
  mounted(){
    setTimeout(()=>{
      this.$store.dispatch('incrementAAction')
       console.log('pagea store dispatch结果', this.$store.state.count,this.$store.state.a.count);

    },5000)
  }
}
</script>
<style>

</style>


