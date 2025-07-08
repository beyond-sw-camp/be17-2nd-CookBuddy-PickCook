import { defineStore } from "pinia";
import { ref } from "vue";

const useModalStore = defineStore('modal',
    () => {
        const isActive = ref(false);
        return { isActive }
    }
);

export default useModalStore;