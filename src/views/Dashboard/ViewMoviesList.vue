<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { TCategoryItem } from "@/types/movies";
import { ROUTE_DASHBOARD_MOVIES_LIST } from "@/app.routes";
import { useMoviesStore } from "@/stores/movies";

import CategoriesTabs from "@/components/CategoriesTabs.vue";
import MovieCard from "@/components/MovieCard.vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const refInfiniteList = ref<null | HTMLDivElement>(null);
const isLoadingNextPage = ref<boolean>(false);
const categories = ref<TCategoryItem[]>([
    {
        name: "All",
        value: [28, 16, 12, 35, 99],
    },
    {
        name: "Action",
        value: [28],
    },
    {
        name: "Animation",
        value: [16],
    },
    {
        name: "Adventure",
        value: [12],
    },
    {
        name: "Comedy",
        value: [35],
    },
    {
        name: "Documentary",
        value: [99],
    },
]);
const currentTab = ref<TCategoryItem>(categories.value[0]);

const storeMovies = useMoviesStore();
const currentPage = computed(() => storeMovies.currentPage)
const moviesGenres = computed(() => storeMovies.moviesGenres)
const end = computed(() => storeMovies.end);

const getGenres = (genre: number[], page: number = 1): Promise<void> => storeMovies.getGenres(genre, page);
const getCategory = (name: string): TCategoryItem | undefined => categories.value.find((e: any) => e.name === name);
const onChangeTab = (tab: TCategoryItem): void  => {
    router.push({
        name: ROUTE_DASHBOARD_MOVIES_LIST.name,
        query: { genre: tab.name },
    });
    currentTab.value = tab;
    getGenres(tab.value, 1);
};

const handleScroll = async (event: any): Promise<void> => {
    const { target } = event;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - (400 * currentPage.value)) {
        if (!end.value && !isLoadingNextPage.value) {
            isLoadingNextPage.value = true;
            const category = currentTab.value || null;
            if (category) await getGenres(category.value, currentPage.value + 1);
            isLoadingNextPage.value = false;
        }
    }
};

onMounted(() => {
    const queryGenre = route.query.genre || null;
    if (queryGenre) {
        let categoryQuery = getCategory(queryGenre as string);
        if (categoryQuery) currentTab.value = categoryQuery;
    }

    const category = currentTab.value;
    if (category) {
        getGenres(category.value, currentPage.value);
    }
});
</script>

<template>
  <div class="db-movies-list flex-1 flex flex-col p-1 pt-16">
    <CategoriesTabs
      :items="categories"
      @onChange="onChangeTab"
      :value="currentTab"
      class="a-04 fadeInDown"
    />

    <div
      ref="refInfiniteList"
      class="a-07 fadeInUp h-10 overflow-y-scroll flex-auto"
      @scroll="handleScroll"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MovieCard
          v-for="(movie, index) in moviesGenres"
          :key="'m-' + index"
          :data="movie"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
