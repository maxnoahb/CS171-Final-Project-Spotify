# devtools::install_github('charlie86/spotifyr')
library(spotifyr)
library(tidyverse)
# library(sentify)

Sys.setenv(SPOTIFY_CLIENT_ID = 'fb867926075141578a9cb053883a3b1f')
Sys.setenv(SPOTIFY_CLIENT_SECRET = 'c01ad3e727e04a39b66045697dcafa7f')

access_token <- get_spotify_access_token()

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

# get playlists——linked to Max's account, gets the 61 countries' Top 50 playlists
my_playlists <- get_user_playlists('122991871') %>% get_playlist_tracks()

# gets audio features for each song in all of those playlists
top_song_features <- get_track_audio_features(my_playlists)

# join the songs' audio features to the playlist, organize by country
all_top_songs <- left_join(top_song_features, my_playlists, by='track_uri') %>% arrange(playlist_name)

# gets frequency of songs in the dataset (number of occurences = how many countries the song charts in)
song_counts <- as.data.frame(table(all_top_songs$track_name)) %>% arrange(desc(Freq))

# write the data to a CSV file
write.csv(all_top_songs, file="/Users/maxnoahb/Desktop/Harvard/Senior Fall/CS 171/FinalProject/data/audio_features.csv", row.names=FALSE)
write.csv(song_counts, file="/Users/maxnoahb/Desktop/Harvard/Senior Fall/CS 171/FinalProject/data/track_frequencies.csv", row.names=FALSE)





# experimenting with lyrics

# song_lyrics <- data.frame()
# for (i in 1:50) {
#   song <- all_top_songs[i,]
#   lyrics = possible_lyrics(artist = song[,'artist_name'], song = song[,'track_name'])
#   song_lyrics <- rbind(lyrics, song_lyrics)
# }

# country_dfs <- split(all_top_songs, all_top_songs$playlist_name)

# for (country in countries_with_spotify) {
#   playlist <- paste(country, " Top 50", sep="")
#   print(playlist)
#   assign(paste(country, "_df", sep=""), country_dfs$playlist)
# }
