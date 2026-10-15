// Run from the repository root; requires ffmpeg with libwebp.
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
mkdirSync('public/robot-frames', { recursive: true })
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
  '-i', 'public/videos/hero-robot-mobile.mp4',
  '-vf', 'scale=512:356:flags=lanczos,tile=4x4', '-fps_mode', 'passthrough',
  '-c:v', 'libwebp', '-quality', '86', 'public/robot-frames/sheet-%02d.webp'], { stdio: 'inherit' })
