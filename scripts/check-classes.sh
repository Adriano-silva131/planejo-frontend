#!/bin/sh
# Barra classes Tailwind com valor arbitrário (p-[13px], bg-[#fff], bg-(--x)): todo valor vem de um token.
if grep -rnE '[a-z0-9]-[[(]' src --include='*.ts' --include='*.tsx'; then
  echo 'Valor arbitrário em classe Tailwind: crie um token em src/app/styles/.'
  exit 1
fi
