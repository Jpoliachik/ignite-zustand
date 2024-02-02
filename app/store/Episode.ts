import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"

interface Enclosure {
  link: string
  type: string
  length: number
  duration: number
  rating: { scheme: string; value: string }
}

export type Episode = {
  guid: string
  title: string
  pubDate: string
  link: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: Enclosure
  categories: string[]
}

export const getParsedTitleAndSubtitle = (episode: Episode) => {
  const defaultValue = { title: episode.title?.trim(), subtitle: "" }

  if (!defaultValue.title) return defaultValue

  const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

  if (!titleMatches || titleMatches.length !== 3) return defaultValue

  return { title: titleMatches[1], subtitle: titleMatches[2] }
}

export const getDatePublished = (episode: Episode) => {
  try {
    const formatted = formatDate(episode.pubDate)
    return {
      textLabel: formatted,
      accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
        date: formatted,
      }),
    }
  } catch (error) {
    return { textLabel: "", accessibilityLabel: "" }
  }
}

export const getDuration = (episode: Episode) => {
  const seconds = Number(episode.enclosure.duration)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor((seconds % 3600) % 60)

  const hDisplay = h > 0 ? `${h}:` : ""
  const mDisplay = m > 0 ? `${m}:` : ""
  const sDisplay = s > 0 ? s : ""
  return {
    textLabel: hDisplay + mDisplay + sDisplay,
    accessibilityLabel: translate("demoPodcastListScreen.accessibility.durationLabel", {
      hours: h,
      minutes: m,
      seconds: s,
    }),
  }
}
