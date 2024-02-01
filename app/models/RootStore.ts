import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import {
  AuthenticationStore,
  authenticationStoreSelector,
  createAuthenticationSlice,
} from "./AuthenticationStore"
import { EpisodeStore, createEpisodeSlice, episodeStoreSelector } from "./EpisodeStore"

export interface RootStore extends AuthenticationStore, EpisodeStore {}

export const useStore = create<RootStore>()((...a) => ({
  ...createAuthenticationSlice(...a),
  ...createEpisodeSlice(...a),
}))

export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector))
export const useEpisodeStore = () => useStore(useShallow(episodeStoreSelector))
