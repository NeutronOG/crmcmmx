"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UsePipelineDragOptions<T> {
  items: T[]
  getId: (item: T) => string
  getStage: (item: T) => string
  onChangeStage: (id: string, newStage: string) => void
}

export function usePipelineDrag<T>({ items, getId, getStage, onChangeStage }: UsePipelineDragOptions<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const columnsRef = useRef<Map<string, HTMLElement>>(new Map())
  const touchRef = useRef<{
    id: string
    el: HTMLElement | null
    ghost: HTMLElement | null
  } | null>(null)

  // ---- HTML5 Drag (desktop) ----
  const onDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
    setDraggingId(id)
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4"
    }
  }, [])

  const onDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
    setDraggingId(null)
    setDragOverStage(null)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stageId)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragOverStage(null)
  }, [])

  const onDrop = useCallback((e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    setDragOverStage(null)
    setDraggingId(null)
    if (id) {
      const item = items.find(i => getId(i) === id)
      if (item && getStage(item) !== stageId) {
        onChangeStage(id, stageId)
      }
    }
  }, [items, getId, getStage, onChangeStage])

  // ---- Touch Drag (iPad / iPhone / mobile) ----
  const onTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    const touch = e.touches[0]
    const el = e.currentTarget as HTMLElement

    const ghost = el.cloneNode(true) as HTMLElement
    ghost.style.position = "fixed"
    ghost.style.zIndex = "9999"
    ghost.style.width = `${el.offsetWidth}px`
    ghost.style.pointerEvents = "none"
    ghost.style.opacity = "0.85"
    ghost.style.transform = "rotate(2deg) scale(1.05)"
    ghost.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"
    ghost.style.left = `${touch.clientX - el.offsetWidth / 2}px`
    ghost.style.top = `${touch.clientY - 30}px`
    document.body.appendChild(ghost)

    el.style.opacity = "0.3"
    setDraggingId(id)

    touchRef.current = { id, el, ghost }
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchRef.current?.ghost) return
    e.preventDefault()
    const touch = e.touches[0]
    const { ghost } = touchRef.current

    ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`
    ghost.style.top = `${touch.clientY - 30}px`

    let foundStage: string | null = null
    columnsRef.current.forEach((colEl, stageId) => {
      const rect = colEl.getBoundingClientRect()
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        foundStage = stageId
      }
    })
    setDragOverStage(foundStage)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchRef.current) return
    const { id, el, ghost } = touchRef.current

    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost)
    if (el) el.style.opacity = "1"

    setDragOverStage(prev => {
      if (prev) {
        const item = items.find(i => getId(i) === id)
        if (item && getStage(item) !== prev) {
          onChangeStage(id, prev)
        }
      }
      return null
    })

    setDraggingId(null)
    touchRef.current = null
  }, [items, getId, getStage, onChangeStage])

  useEffect(() => {
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd)
    return () => {
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [onTouchMove, onTouchEnd])

  const registerColumn = useCallback((stageId: string, el: HTMLElement | null) => {
    if (el) columnsRef.current.set(stageId, el)
  }, [])

  return {
    draggingId,
    dragOverStage,
    registerColumn,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
  }
}
