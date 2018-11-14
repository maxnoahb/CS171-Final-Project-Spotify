# devtools::install_github('charlie86/spotifyr')
library(spotifyr)
library(tidyverse)
# library(sentify)

Sys.setenv(SPOTIFY_CLIENT_ID = 'fb867926075141578a9cb053883a3b1f')
Sys.setenv(SPOTIFY_CLIENT_SECRET = 'c01ad3e727e04a39b66045697dcafa7f')

access_token <- get_spotify_access_token()

spotify_df <- get_artist_audio_features('kendrick lamar')

countries_with_spotify <- c('Japan', 'Israel', 'Hong Kong', 'Indonesia', 'Malaysia', 'Philippines', 
                           'Singapore', 'Taiwan', 'Thailand', 'Vietnam', 'Andorra', 'Austria', 'Belgium', 
                           'Bulgaria', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 
                           'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 
                           'Lithuania', 'Luxembourg', 'Malta', 'Monaco', 'Netherlands', 'Norway', 'Poland', 
                           'Portugal', 'Romania', 'Slovakia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 
                           'United Kingdom', 'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Costa Rica', 
                           'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'Mexico', 
                           'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Uruguay', 'Canada', 'United States',
                           'South Africa', 'Australia', 'New Zealand')

my_playlists <- get_user_playlists('122991871') %>% get_playlist_tracks()
# get_playlist_audio_features(username="122991871", playlist_uris=list(my_playlists[,"playlist_uri"]))
top_song_features <- get_track_audio_features(my_playlists)

all_top_songs <- left_join(top_song_features, my_playlists, by='track_uri') %>% arrange(playlist_name)

# country_dfs <- split(all_top_songs, all_top_songs$playlist_name)

write.csv(all_top_songs, file="music_data.csv", row.names=FALSE)

song_lyrics <- data.frame()
for (i in 1:10) {
  song <- all_top_songs[i,]
  # print(song[,'track_name'])
  lyrics = possible_lyrics(artist = song[,'artist_name'], song = song[,'track_name'])
  song_lyrics <- rbind(lyrics, song_lyrics)
}

# for (country in countries_with_spotify) {
#   playlist <- paste(country, " Top 50", sep="")
#   print(playlist)
#   assign(paste(country, "_df", sep=""), country_dfs$playlist)
# }
  






# popular_keys <- spotify_df %>% 
#   count(key_mode, sort = TRUE) %>% 
#   head(5)
# 
# recently_played <- get_my_recently_played(limit = 5) %>% 
#   select(track_name, artist_name, album_name, played_at_utc)
# 
# top_artists <- get_my_top_artists(time_range = 'long_term', limit = 5) %>% 
#   # select(artist_name, artist_genres) %>% 
#   rowwise %>% 
#   mutate(artist_genres = paste(artist_genres, collapse = ', ')) %>% 
#   ungroup
# 
# top_tracks_lately <- get_my_top_tracks(time_range = 'short_term', limit = 5) %>% 
#   select(track_name, artist_name, album_name)
