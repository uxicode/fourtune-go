import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import InputView from "@/views/InputView.vue"
import ResultView from "@/views/ResultView.vue"

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/input", name: "input", component: InputView },
    { path: "/result", name: "result", component: ResultView },
  ],
})
