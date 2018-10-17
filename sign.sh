#!/bin/bash
cd platforms/android/app/build/outputs/apk/release/
rm PawikanMonitoring.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore  /media/dolf/dolf/Android/release-key.jks app-release-unsigned.apk dolfandringa-release-keys
/media/dolf/dolf/Android/Sdk/build-tools/27.0.3/zipalign -v 4 app-release-unsigned.apk PawikanMonitoring.apk
