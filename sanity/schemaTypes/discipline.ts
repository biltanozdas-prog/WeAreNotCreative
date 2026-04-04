import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discipline',
  title: 'Discipline',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  preview: { select: { title: 'title' } },
})
