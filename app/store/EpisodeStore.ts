import { api } from "../services/api"
import { Episode } from "./Episode"
import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"

export interface EpisodeStore {
  episodes: Episode[]
  favorites: string[]
  favoritesOnly: boolean

  fetchEpisodes: () => Promise<void>
  addFavorite: (episode: Episode) => void
  removeFavorite: (episode: Episode) => void
  toggleFavorite: (episode: Episode) => void
  setFavoritesOnly: (value: boolean) => void
}

export const createEpisodeSlice: StateCreator<RootStore, [], [], EpisodeStore> = (set, get) => ({
  episodes: [],
  favorites: [],
  favoritesOnly: false,

  fetchEpisodes: async () => {
    const response = await api.getEpisodes()
    if (response.kind === "ok") {
      set({ episodes: response.episodes })
    } else {
      console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
    }
  },
  addFavorite: (episode) => set((state) => ({ favorites: [...state.favorites, episode.guid] })),
  removeFavorite: (episode) =>
    set((state) => ({ favorites: state.favorites.filter((guid) => guid !== episode.guid) })),
  toggleFavorite: (episode) => {
    if (get().favorites.includes(episode.guid)) {
      get().removeFavorite(episode)
    } else {
      get().addFavorite(episode)
    }
  },
  setFavoritesOnly: (value: boolean) => set({ favoritesOnly: value }),
})

export const episodeStoreSelector = (state: RootStore) => ({
  episodes: state.episodes,
  favorites: state.favorites,
  favoritesOnly: state.favoritesOnly,

  episodesForList: getEpisodesForList(state),

  fetchEpisodes: state.fetchEpisodes,
  addFavorite: state.addFavorite,
  removeFavorite: state.removeFavorite,
  toggleFavorite: state.toggleFavorite,
  setFavoritesOnly: state.setFavoritesOnly,

  hasFavorite: (episode: Episode) => {
    return state.favorites.includes(episode.guid)
  },
})

export const getEpisodesForList = (store: EpisodeStore) => {
  return store.favoritesOnly
    ? store.episodes.filter((a) => store.favorites.includes(a.guid))
    : store.episodes
}
