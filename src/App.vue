<template>
    <div>
        hello app
        <li v-for="(todo, index) in todos" :key="index">{{todo}}</li>
    </div>
</template>

<script lang="ts">
import {Component,Vue} from 'vue-property-decorator';

@Component({
    components:{
        // todo...

    }
})
export default class Todo extends Vue{
    public todos:string[] = ['小象','小鹿','小虎']
}
</script>