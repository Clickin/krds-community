<script lang="ts">
  import type { KrdsAdditionalProps, KrdsTone } from '@krds-community/recipes';

  type Props = Omit<KrdsAdditionalProps, 'className'> & {
    children?: import('svelte').Snippet;
    className?: string;
  };
  type Item = NonNullable<Props['items']>[number];

  let {
    kind = 'surface', id = 'krds-additional', label = '레이블', title = '제목', description = '', hint = '', tone = 'primary', appearance = 'outline', size = 'medium', number = false,
    href = '#', message = '도움말', position = 'top', open = false, disabled = false, value = '', modelValue = '', options = [], items = [], links = [], slides = [], tabs = [], panels = {}, steps = [], columns = [], rows = [], className = '', children,
    ...rest
  }: Props = $props();
  let isOpen = $state(false);
  let selected = $state('');
  let activeIndex = $state(0);
  let checked = $state(false);
  let currentValue = $state('');
  const toneClass: Record<KrdsTone, string> = { primary: 'primary', secondary: 'secondary', gray: 'gray', point: 'point', danger: 'danger', warning: 'warning', success: 'success', information: 'information', disabled: 'disabled' };
  const labelOf = (item: Item) => typeof item === 'string' ? item : 'label' in item ? item.label : item.title;
  const setValue = (event: Event) => { currentValue = (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value; };
  $effect(() => { isOpen = open; });
  $effect(() => { selected = String(modelValue || options[0]?.value || tabs[0]?.id || ''); });
  $effect(() => { checked = Boolean(modelValue); });
  $effect(() => { currentValue = String(value || modelValue || ''); });
</script>

{#if kind === 'badge' || kind === 'badge-number' || kind === 'badge-size'}
  <span {...rest} class={`krds-badge ${appearance === 'outline' ? `outline-${toneClass[tone]}` : `bg-${appearance === 'light' ? 'light-' : ''}${toneClass[tone]}`} ${size} ${number ? 'number' : ''} ${className}`}>{label}</span>
{:else if kind === 'breadcrumb'}
  <nav {...rest} class={`krds-breadcrumb-wrap ${className}`} aria-label="현재 경로"><ol>{#each items as item, index}<li class:home={index === 0}><a href={'href' in item ? item.href ?? '#' : '#'} aria-current={index === items.length - 1 ? 'page' : undefined}>{labelOf(item)}</a></li>{/each}</ol></nav>
{:else if kind === 'button-icon'}
  <button {...rest} type="button" class={`krds-btn icon ${size} ${className}`} aria-label={label}><span aria-hidden="true">⌕</span></button>
{:else if kind === 'button-text' || kind === 'button-with-icon'}
  <button {...rest} type="button" class={`krds-btn ${kind === 'button-text' ? 'text' : ''} ${className}`}>{label}{kind === 'button-with-icon' ? ' →' : ''}</button>
{:else if kind === 'button-hierarchy' || kind === 'button-size'}
  <button {...rest} type="button" disabled={disabled} class={`krds-button ${className}`} data-variant={tone} data-size={size}>{label}</button>
{:else if kind === 'calendar' || kind === 'date-input'}
  <label class={`krds-field ${className}`}><span class="krds-field-label">{label}</span><input {...rest} id={id} type="date" value={currentValue} oninput={setValue} class="krds-input" />{#if hint}<span class="krds-field-message">{hint}</span>{/if}</label>
{:else if kind === 'calendar-range'}
  <fieldset {...rest} class={`krds-calendar-area ${className}`}><legend>{label}</legend><input type="date" aria-label="시작일" /><span aria-hidden="true">–</span><input type="date" aria-label="종료일" /></fieldset>
{:else if kind === 'carousel' || kind === 'carousel-banner'}
  {@const slide = slides[activeIndex] ?? { id: 'empty', title }}
  <section {...rest} class={`krds-carousel ${className}`} aria-roledescription="carousel" aria-label={label}><p aria-live="polite">{activeIndex + 1} / {Math.max(slides.length, 1)}</p><h3>{slide.title}</h3>{#if slide.description}<p>{slide.description}</p>{/if}<button type="button" aria-label="이전 슬라이드" onclick={() => activeIndex = (activeIndex - 1 + slides.length) % slides.length}>이전</button><button type="button" aria-label="다음 슬라이드" onclick={() => activeIndex = (activeIndex + 1) % slides.length}>다음</button></section>
{:else if kind === 'checkbox-chip' || kind === 'radio-chip' || kind === 'checkbox-size' || kind === 'radio-size'}
  <label {...rest} class={`krds-form-chip ${className}`}><input type={kind.startsWith('radio') ? 'radio' : 'checkbox'} name={rest.name} value={value} disabled={disabled} /><span>{label}</span></label>
{:else if kind === 'coach-mark'}
  <aside {...rest} class={`krds-coach-mark ${className}`} aria-label={title}><h2>{title}</h2><p>{description}</p><button type="button">다음</button><button type="button" onclick={() => isOpen = false}>닫기</button></aside>
{:else if kind === 'contextual-help'}
  <details {...rest} class={`krds-contextual-help ${position} ${className}`}><summary>{label}</summary><div class="tooltip-txt">{description || message}</div></details>
{:else if kind === 'critical-alerts'}
  <div {...rest} class={`krds-critical-alerts ${className}`} role="alert"><ul>{#each items as item}<li>{labelOf(item)}</li>{/each}</ul></div>
{:else if kind === 'disclosure'}
  <details {...rest} class={`krds-disclosure ${className}`} open={isOpen} ontoggle={(event) => isOpen = (event.currentTarget as HTMLDetailsElement).open}><summary>{title}</summary><div class="expand-wrap">{description}{#if children}{@render children()}{/if}</div></details>
{:else if kind === 'favicon'}
  <link rel="icon" href={href} sizes={size === 'medium' ? '32x32' : size} type="image/png" />
{:else if kind === 'file-upload'}
  <div {...rest} class={`krds-file-upload ${className}`}><label>{label}<input type="file" multiple={Boolean(rest.multiple)} onchange={(event) => currentValue = Array.from((event.currentTarget as HTMLInputElement).files ?? []).map((file) => file.name).join(', ')} /></label>{#if currentValue}<p aria-live="polite">{currentValue}</p>{/if}</div>
{:else if kind === 'footer'}
  <footer {...rest} class={`krds-footer ${className}`}><strong>{title}</strong>{#if links.length}<nav aria-label="하단 메뉴"><ul>{#each links as item}<li><a href={item.href ?? '#'}>{item.label}</a></li>{/each}</ul></nav>{/if}</footer>
{:else if kind === 'header' || kind === 'main-menu-mobile' || kind === 'main-menu-pc'}
  <svelte:element this={kind === 'header' ? 'header' : 'nav'} {...rest} aria-label={kind === 'header' ? undefined : kind === 'main-menu-mobile' ? '모바일 메뉴 컨테이너' : '데스크톱 메뉴 컨테이너'} class={`krds-${kind === 'header' ? 'header' : kind === 'main-menu-mobile' ? 'main-menu-mobile' : 'main-menu'} ${className}`}><a href="/">{title}</a><button type="button" aria-expanded={isOpen} aria-controls={`${id}-${kind}-menu`} onclick={() => isOpen = !isOpen}>메뉴</button><nav id={`${id}-${kind}-menu`} aria-label={kind === 'header' ? '헤더 주 메뉴' : kind === 'main-menu-mobile' ? '모바일 주 메뉴' : '주 메뉴'} hidden={!isOpen && kind === 'main-menu-mobile'}><ul>{#each links as item}<li><a href={item.href ?? '#'}>{item.label}</a></li>{/each}</ul></nav></svelte:element>
{:else if kind === 'help-panel' || kind === 'tutorial-panel'}
  <aside {...rest} class={`krds-help-panel ${className}`} hidden={!isOpen} aria-label={title}><div>{description}{#if children}{@render children()}{/if}</div><button type="button" onclick={() => isOpen = false}>접어두기</button></aside>
{:else if kind === 'identifier'}
  <div {...rest} class={`krds-identifier ${className}`}><span class="logo" aria-hidden="true">◎</span><span>{title}</span>{#if description}<small>{description}</small>{/if}</div>
{:else if kind === 'in-page-navigation'}
  <nav {...rest} class={`krds-in-page-navigation-area ${className}`} aria-label={title}><strong>{title}</strong><ul>{#each links as item}<li><a href={item.href ?? `#${item.id ?? item.label}`}>{item.label}</a></li>{/each}</ul></nav>
{:else if kind === 'language-switcher' || kind === 'language-switcher-page'}
  <label {...rest} class={`krds-language ${className}`}><span class="sr-only">언어 선택</span><select bind:value={selected}>{#each options as option}<option value={option.value} disabled={option.disabled}>{option.label}</option>{/each}</select></label>
{:else if kind === 'link'}
  <a {...rest} href={href} class={`krds-link ${className}`}>{label}{rest.target ? ' ↗' : ''}</a>
{:else if kind === 'masthead'}
  <div {...rest} class={`krds-masthead ${className}`} role="note">{description || '이 누리집은 대한민국 공식 전자정부 누리집입니다.'}</div>
{:else if kind === 'modal' || kind === 'modal-sample'}
  <dialog {...rest} class={`krds-modal ${className}`} open={isOpen} aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2><div>{description}{#if children}{@render children()}{/if}</div><button type="button" onclick={() => isOpen = false}>닫기</button></dialog>
{:else if kind === 'pagination'}
  <nav {...rest} class={`krds-pagination ${className}`} aria-label="페이지 이동"><button type="button" disabled={Number(modelValue) <= 1}>이전</button><div class="page-links">{#each [1, 2, 3, 4, 5] as page}<button type="button" class:active={page === Number(modelValue || 1)} aria-current={page === Number(modelValue || 1) ? 'page' : undefined} onclick={() => modelValue = String(page)}>{page}</button>{/each}</div><button type="button">다음</button></nav>
{:else if kind === 'resize'}
  <label {...rest} class={`krds-resize ${className}`}>화면크기<select bind:value={selected}><option value="100">기본</option><option value="125">크게</option><option value="150">가장 크게</option></select></label>
{:else if kind === 'select' || kind === 'select-size' || kind === 'select-state' || kind === 'select-sorting'}
  <label {...rest} class={`krds-field ${className}`}><span class="krds-field-label">{label}</span><select id={id} bind:value={selected} class={`krds-form-select ${kind === 'select-sorting' ? 'krds-form-select-sort' : ''} ${kind === 'select-state' && !selected ? 'is-error' : ''}`}>{#each options as option}<option value={option.value} disabled={option.disabled}>{option.label}</option>{/each}</select>{#if hint}<span class="krds-field-message">{hint}</span>{/if}</label>
{:else if kind === 'side-navigation'}
  <nav {...rest} class={`krds-side-navigation ${className}`} aria-label={title}><h2>{title}</h2><ul>{#each links as item}<li><a href={item.href ?? '#'}>{item.label}</a></li>{/each}</ul></nav>
{:else if kind === 'skip-link'}
  <div {...rest} class={`krds-skip-link ${className}`}><a href={href}>{label || '본문 바로가기'}</a></div>
{:else if kind === 'spinner'}
  <output {...rest} class={`krds-spinner ${className}`} aria-live="polite">⟳ {label || '처리 중'}</output>
{:else if kind === 'step-indicator'}
  <ol {...rest} class={`krds-step-wrap ${className}`}>{#each steps as step, index}<li class:done={index < Number(modelValue || 0)} aria-current={index === Number(modelValue || 0) ? 'step' : undefined}><span>{index + 1}</span><strong>{step.label}</strong></li>{/each}</ol>
{:else if kind === 'structured-list'}
  <ul {...rest} class={`krds-structured-list ${className}`}>{#each items as item}<li><strong>{labelOf(item)}</strong>{#if 'description' in item}<p>{item.description}</p>{/if}</li>{/each}</ul>
{:else if kind === 'structured-list-table' || kind === 'table'}
  <div {...rest} class={`krds-table-wrap ${className}`}><table><caption>{title}</caption><thead><tr>{#each columns as column}<th scope="col">{column.label}</th>{/each}</tr></thead><tbody>{#each rows as row, rowIndex}<tr>{#each columns as column, columnIndex}{#if columnIndex === 0}<th scope="row">{row[column.key]}</th>{:else}<td>{row[column.key]}</td>{/if}{/each}</tr>{/each}</tbody></table></div>
{:else if kind === 'tab'}
  {@const active = selected || tabs[0]?.id || ''}
  <div {...rest} class={`krds-tab-area ${className}`}><div role="tablist">{#each tabs as tab}<button type="button" role="tab" id={`tab-${tab.id}`} aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} onclick={() => selected = tab.id}>{tab.label}</button>{/each}</div>{#each tabs as tab}<div role="tabpanel" tabindex="0" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id}>{panels[tab.id] ?? (tab.id === active ? description : '')}</div>{/each}</div>
{:else if kind === 'tag' || kind === 'tag-link'}
  {#if kind === 'tag-link'}<a {...rest} href={href} class={`krds-btn-tag link ${className}`}>{label}</a>{:else}<span {...rest} class={`krds-btn-tag bg-${toneClass[tone]} ${className}`}>{label}</span>{/if}
{:else if kind === 'textarea'}
  <label class={`krds-field ${className}`}><span class="krds-field-label">{label}</span><textarea id={id} class="krds-input" maxlength="100" value={currentValue} oninput={setValue}></textarea><span aria-live="polite">{currentValue.length}/100</span></label>
{:else if kind === 'text-input-icon'}
  <div {...rest} class={`krds-input-with-icon ${className}`}><input id={id} class="krds-input" aria-label={label || '입력 보조 텍스트'} value={currentValue} oninput={setValue} /><button type="button" aria-label="입력 보조 기능">⌕</button></div>
{:else if kind === 'text-list' || kind === 'text-list-ordered'}
  <svelte:element this={kind === 'text-list-ordered' ? 'ol' : 'ul'} {...rest} class={`krds-info-list ${className}`}>{#each items as item}<li>{labelOf(item)}</li>{/each}</svelte:element>
{:else if kind === 'tooltip' || kind === 'tooltip-box' || kind === 'tooltip-vertical'}
  <span class="krds-tooltip-wrap"><button {...rest} type="button" class={`krds-btn krds-tooltip ${className}`} aria-describedby={`${id}-tip`}>{label}</button><span id={`${id}-tip`} role="tooltip">{message}</span></span>
{:else if kind === 'tts' || kind === 'tts-icon' || kind === 'tts-size'}
  <button {...rest} type="button" class={`krds-tts ${className}`} aria-pressed={checked} onclick={() => checked = !checked}><span class="krds-tts-icon" aria-hidden="true">{checked ? '▶' : '🔊'}</span>{kind === 'tts-icon' ? `<span class="sr-only">${label}</span>` : label}</button>
{:else if kind === 'toggle-switch' || kind === 'toggle-switch-size'}
  <div {...rest} class={`krds-form-toggle-switch ${size} ${className}`}><input id={id} type="checkbox" bind:checked disabled={disabled} /><label for={id}><span class="switch-toggle" aria-hidden="true"><i></i></span>{label}</label></div>
{:else if kind === 'radio-button' || kind === 'radio-size'}
  <label {...rest} class={`krds-form-check ${className}`}><input type="radio" name={rest.name} value={value} /><span>{label}</span></label>
{:else if children}
  {@render children()}
{:else}
  <div {...rest} class={className}>{description}</div>
{/if}
