/**
 * ANSI Colors: https://i.stack.imgur.com/sbSCk.png
 */
// import * as fs    from 'fs'
import * as path  from 'path'

import {
  widget,
  Widgets,
}             from 'blessed'

declare module 'blessed' {
  // tslint:disable-next-line
  namespace widget {
    // tslint:disable-next-line
    class Image extends Widgets.ImageElement {}
  }

  // tslint:disable-next-line
  namespace Widgets {
    interface Border {
      top?:    boolean,
      bottom?: boolean,
    }
  }
}

import * as updateNotifier  from 'update-notifier'

// const contrib               = require('blessed-contrib')

import {
  MODULE_ROOT,
  VERSION,
}               from '../src/config'

const FILE_FACENET_ICON_PNG = path.join(MODULE_ROOT, 'docs', 'images', 'facenet-icon.png')

function checkUpdate() {
  const pkgFile   = path.join(MODULE_ROOT, 'package.json')
  const pkg       = require(pkgFile)
  const notifier  = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
  })
  notifier.notify()
}

async function splashScreen(screen: widget.Screen): Promise<void> {
  screen.title = 'FaceNet Manager';

  const box = new widget.Box({
    top: 0,
    left: 0,
    width: screen.width,
    height: screen.height,
    padding: 0,
    // content: 'Hello {bold}world{/bold}!',
    style: {
      fg: 'green',
      bg: 'blue',
    },
  })
  screen.append(box)

  const imageOptions: Widgets.ImageOptions = {
    file: FILE_FACENET_ICON_PNG,
    type: 'ansi',
    left: 'center',
    top: 0,
    width: 32,
    height: 16,
  }
  const icon = new widget.Image(imageOptions)

  screen.append(icon)

  // http://artscene.textfiles.com/ansi/artwork/face.ans
  // const asciiArt = fs.readFileSync('face.ans').toString()
  // const art = new widget.Terminal({
  //   parent: screen,
  //   top: 0,
  //   left: 'center',
  //   height: 24,
  //   // some are 78/80, some are 80/82
  //   width: 70,
  //   // border: 'line',
  //   // content: faceAns,
  //   // tags: true,
  //   // label: ' {bold}{cyan-fg}ANSI Art{/cyan-fg}{/bold} (Drag Me) ',
  //   style: {
  //     bg: 'blue',
  //   },
  //   handler: function() {/* */},
  //   // draggable: true,
  // })

  // Append our box to the screen.
  // screen.append(art)

  // art.term.reset()
  // art.term.write(asciiArt)
  // art.term.cursorHidden = true

  const bigText = new widget.BigText({
    top: 16,
    left: 'center',
    // border: 'line',
    width: 60,
    height: 16,
    content: 'FaceNet',
    style: {
      fg: 'green',
      bg: 'blue',
    },
  })

  // console.log(typeof bigText)
  screen.append(bigText)

  const version = new widget.Box({
    top: 29,
    left: 'center',
    height: 1,
    width: 50,
    align: 'right',
    style: {
      fg: 'white',
      bg: 'blue',

    },
    content: 'Manager version ' + VERSION,
  })
  screen.append(version)

  const pressKey = new widget.Box({
    top: (screen.height) as number - 5,
    left: 'center',
    height: 1,
    width: 30,
    style: {
      fg: 'white',
      bg: 'blue',
    },
    content: 'Press any key to continue...',
  })

  screen.append(pressKey)
  const timer = setInterval(() => {
    pressKey.visible
      ? pressKey.hide()
      : pressKey.show()
  }, 1000)

  screen.render()

  return new Promise<void>((resolve) => {
    screen.once('keypress', () => {
      clearInterval(timer)
      pressKey.hide()
      resolve()
    })

    function onClick(data: any) {
      if (data.action === 'mouseup') {
        clearInterval(timer)
        pressKey.hide()
        screen.removeListener('mouse', onClick)
        return resolve()
      }
    }
    screen.on('mouse', onClick)

  })
}

async function clear(screen: widget.Screen) {
  let i = screen.children.length
  while (i--) {
    screen.children[i].detach()
  }
}

async function mainScreen(screen: widget.Screen) {
  const THUMB_HEIGHT = 20

  let top   = 0

  const header = new widget.Box({
    top,
    left: 0,
    width: '100%',
    height: 1,
    style: {
      bg: 'blue',
    },
  })
  screen.append(header)
  top += 1

  const imageOptions: Widgets.ImageOptions = {
    file: FILE_FACENET_ICON_PNG,
    type: 'ansi',
    right: 0,
    top: 0,
    border: 'line',
    style: {
      border: {
        fg: 'cyan',
      },
    },
    width: 40,
    height: THUMB_HEIGHT,
  }

  imageOptions.top = top
  // Blessed issue #309 https://github.com/chjj/blessed/issues/309
  const thumb1 = new widget.Image(
    Object.assign({}, imageOptions))
  screen.append(thumb1)
  top += THUMB_HEIGHT

  const distance12 = new widget.Box({
    top,
    right: 0,
    width: 40,
    height: 1,
    bg: 'green',
    fg: 'white',
    tags: true,
    content: '{center}distance: 0.63{/center}',
  })
  screen.append(distance12)
  top += 1

  imageOptions.top = top
  const thumb2 = new widget.Image(
    Object.assign({}, imageOptions))
  screen.append(thumb2)
  top += THUMB_HEIGHT

  const distance23 = new widget.Box({
    top,
    right: 0,
    width: 40,
    height: 1,
    bg: 'red',
    fg: 'white',
    tags: true,
    content: '{center}distance: 1.43{/center}',
  })
  screen.append(distance23)
  top += 1

  imageOptions.top = top
  const thumb3 = new widget.Image(Object.assign({}, imageOptions))
  screen.append(thumb3)

  const status = new widget.Box({
    parent: screen,
    bottom: 0,
    right: 0,
    height: 1,
    width: 'shrink',
    style: {
      bg: 'blue',
    },
    content: 'Select your piece of ANSI art (`/` to search).',
  });
  screen.append(status)
  screen.render()

  // const manager = new Manager(screen)

  // ui.thumb = 'file1.png'
  // ui.thumb = 'file2.png'
  // ui.thumb = 'file3.png'

  // ui.image = 'file-large.png'
  // ui.

}

async function main(): Promise<number> {
  checkUpdate()

  const screen = new widget.Screen({
    smartCSR: true,
    warnings: true,
  })

  screen.key(['escape', 'q', 'x', 'C-q', 'C-x', 'f4', 'f10'], (/* ch: any, key: any */) => {
    screen.destroy()
  })

  screen.key('f5', () => {
    //
  })

  // const grid = new contrib.grid({
  //   rows: 1,
  //   cols: 1,
  //   screen,
  // })

  await splashScreen(screen)

  clear(screen)
  screen.render()

  await mainScreen(screen)

  return new Promise<number>((resolve) => {
    screen.once('destroy', () => resolve(0))
  })
}

main()
.then(process.exit)
.catch(e => {
  console.error(e)
  process.exit(1)
})
