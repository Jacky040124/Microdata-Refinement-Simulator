import { ThreeApp } from '@/lib/ThreeApp'
import { GitHubStarButton } from '@/ui/GitHubStarButton'
import { MusicPlayerWidget } from '@/ui/MusicPlayerWidget'

interface OverlayControllerOptions {
  threeApp: ThreeApp
  repoUrl: string
  repoName: string
}

export class OverlayController {
  private overlayElement: HTMLDivElement | null = null
  private headerElement: HTMLDivElement | null = null
  private devButton: HTMLButtonElement | null = null
  private devMode = false
  private musicPlayer = new MusicPlayerWidget()
  private gitHubButton: GitHubStarButton
  private mountNode: HTMLElement
  private options: OverlayControllerOptions

  constructor(mountNode: HTMLElement, options: OverlayControllerOptions) {
    this.mountNode = mountNode
    this.options = options
    this.gitHubButton = new GitHubStarButton(options.repoUrl, options.repoName)
  }

  init() {
    this.devMode = this.options.threeApp.getDevMode()
    this.render()
  }

  destroy() {
    this.musicPlayer.destroy()
    this.gitHubButton.destroy()

    if (this.overlayElement && this.overlayElement.parentElement === this.mountNode) {
      this.mountNode.removeChild(this.overlayElement)
    }

    this.overlayElement = null
    this.headerElement = null
    this.devButton = null
  }

  private render() {
    this.overlayElement = document.createElement('div')
    this.overlayElement.className = 'minimal-overlay'

    this.devButton = this.createDevButton()

    this.headerElement = document.createElement('div')
    this.headerElement.className = 'header-controls'
    this.headerElement.appendChild(this.gitHubButton.element)
    this.headerElement.appendChild(this.devButton)

    this.overlayElement.appendChild(this.musicPlayer.element)
    this.overlayElement.appendChild(this.headerElement)

    this.mountNode.replaceChildren(this.overlayElement)
    this.syncUiState()
  }

  private syncUiState() {
    this.musicPlayer.setEnabled(!this.devMode)
    this.toggleGitHubButtonVisibility(!this.devMode)
    if (this.devButton) {
      this.updateDevButtonStyle(this.devButton, this.devMode)
      this.devButton.textContent = this.devMode ? 'Dev Mode ON' : 'Dev Mode'
    }
  }

  private createDevButton() {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'lumon-button' // Use the global Lumon button class
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.handleToggleDevMode()
    })
    
    // Remove inline styles that are now handled by CSS class
    // Keep only what's not in the CSS if necessary (none in this case)
    
    return button
  }

  private toggleGitHubButtonVisibility(show: boolean) {
    const element = this.gitHubButton.element
    element.style.display = show ? 'inline-flex' : 'none'
  }

  private updateDevButtonStyle(button: HTMLButtonElement, isDevMode: boolean) {
    if (isDevMode) {
      button.classList.add('active')
    } else {
      button.classList.remove('active')
    }
    
    // Clear manual style overrides to let CSS classes take over
    button.style.backgroundColor = ''
    button.style.color = ''
    button.style.borderColor = ''
  }

  private handleToggleDevMode() {
    const nextState = this.options.threeApp.toggleDevMode()
    this.devMode = nextState
    this.syncUiState()
  }
}
