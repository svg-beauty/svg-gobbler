import { Svg } from './svg'

export class Image extends Svg {
  /**
   * The absolute URL of the image source. If this is present, the SVG
   * is an image element with an external source. It will require a fetch
   * to get the SVG source. If it fails, the image is retained with the cors
   * src attribute.
   */
  absoluteImageUrl?: string

  constructor(originalString: string, origin: string) {
    super(originalString, origin)
    this.asElement = this.parseAndReturnElement()
    this.processImage()
  }

  /**
   * I don't love setting properties in a method, but I'm not sure
   * how else to do this. I need to be able to await the async processImage
   * method, but I can't do that in the constructor.
   */
  processImage() {
    if (!this.asElement) return

    const src = this.asElement.getAttribute('src')
    if (!src) return

    switch (true) {
      case src.includes('data:image/svg+xml;base64'): {
        const base64Index = src.indexOf(',') + 1
        const base64String = src.slice(base64Index, src.length - 1) // -1 to exclude the trailing quote
        this.originalString = this.base64DecodeUnicode(base64String)
        this.asElement = this.parseFromString('image/svg+xml')
        break
      }

      case src.includes('data:image/svg+xml;utf8'): {
        const svgStart = src.indexOf('<svg')
        const svgEnd = src.lastIndexOf('</svg>') + 6 // 6 is the length of "</svg>"
        const svgString = src.slice(svgStart, svgEnd)
        this.originalString = svgString[0]
        this.asElement = this.parseFromString('image/svg+xml')
        break
      }

      case src.includes('.svg'): {
        this.absoluteImageUrl = this.getAbsoluteImageSrc(src)
        break
      }
    }
  }

  /**
   * Creates an absolute URL from the image src of an image element.
   */
  private getAbsoluteImageSrc(src: string) {
    return src.startsWith('http') ? src : `${this.origin.replace(/\/$/, '')}${src}`
  }

  /**
   * * Decodes a base64-encoded Unicode string.
   *
   * This function first decodes the base64 string using the built-in `atob` function.
   * It then splits the resulting string into an array of characters and encodes each character
   * into its hexadecimal representation. The encoded characters are then assembled into a string
   * and decoded using `decodeURIComponent` to handle any special Unicode characters.
   */
  private base64DecodeUnicode(str: string): string {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
  }

  /**
   * Parses a given HTML string and returns the first element in its body.
   *
   * This function constructs a complete HTML document by embedding the original HTML string (`this.originalString`)
   * inside the body tags. It sets the `<base href>` to the current origin (`this.origin`) in the head section.
   */
  private parseAndReturnElement() {
    const htmlSource = `<!DOCTYPE html><html><head><base href=${this.origin}></head><body>${this.originalString}</body></html>`
    const element = new DOMParser().parseFromString(htmlSource, 'text/html')

    const hasParsingError = Boolean(element.querySelector('parsererror'))
    const hasFirstElementChild = Boolean(element.body.firstElementChild)

    if (hasParsingError || !hasFirstElementChild) {
      return
    }

    return element.body.firstElementChild as Element
  }

  /**
   *
   */
  async fetchSvgContent() {
    if (!this.absoluteImageUrl) return this

    try {
      const response = await fetch(this.absoluteImageUrl, { mode: 'cors' })
      const text = await response.text()
      this.originalString = text
      this.asElement = this.parseFromString('image/svg+xml')
      return this
    } catch (error) {
      console.log(error)
      return this
    }
  }
}
