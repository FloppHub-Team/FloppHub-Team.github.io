-- ============================================
-- REDZ HUB : SLAP BATTLES - CÓDIGO LIMPIO (CRACKEADO)
-- =============================================

-- Servicios principales
local Services = {
    Players = game:GetService("Players"),
    TweenService = game:GetService("TweenService"),
    RunService = game:GetService("RunService"),
    ReplicatedStorage = game:GetService("ReplicatedStorage"),
    TeleportService = game:GetService("TeleportService"),
    UserInputService = game:GetService("UserInputService"),
    StarterGui = game:GetService("StarterGui")
}

-- Variables globales
local LocalPlayer = Services.Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")
local Workspace = game.workspace

-- ============================================
-- MÓDULO DE INICIALIZACIÓN DEL HUB
-- ============================================
function InitializeHub()
    -- Crear ScreenGui principal
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "RedzHubIntro"
    ScreenGui.ResetOnSpawn = false
    ScreenGui.IgnoreGuiInset = true
    ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    ScreenGui.Parent = PlayerGui
    
    -- Frame principal
    local MainFrame = Instance.new("Frame")
    MainFrame.Size = UDim2.fromScale(1, 1)
    MainFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
    MainFrame.BackgroundTransparency = 0.2
    MainFrame.Parent = ScreenGui
    
    -- Título
    local TitleLabel = Instance.new("TextLabel")
    TitleLabel.Size = UDim2.fromScale(0.5, 0.1)
    TitleLabel.Position = UDim2.fromScale(0.5, 0.3)
    TitleLabel.AnchorPoint = Vector2.new(0.5, 0.5)
    TitleLabel.Text = "FloppHub Team On Top"
    TitleLabel.TextScaled = true
    TitleLabel.Font = Enum.Font.GothamBold
    TitleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    TitleLabel.TextStrokeTransparency = 0.5
    TitleLabel.TextStrokeColor3 = Color3.fromRGB(0, 0, 0)
    TitleLabel.Parent = MainFrame
    
    -- Gradiente
    local Gradient = Instance.new("UIGradient")
    Gradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 0, 0)),
        ColorSequenceKeypoint.new(0.5, Color3.fromRGB(255, 165, 0)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 0))
    })
    Gradient.Rotation = 45
    Gradient.Parent = TitleLabel
    
    -- Sonido de introducción
    local IntroSound = Instance.new("Sound")
    IntroSound.SoundId = "rbxassetid://107004225739474"
    IntroSound.Volume = 0.5
    IntroSound.Parent = ScreenGui
    
    -- Tween de apertura
    local TweenInfo = TweenInfo.new(2, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
    local OpenTween = TweenService:Create(MainFrame, TweenInfo, {BackgroundTransparency = 0})
    OpenTween:Play()
    
    task.wait(3)
    
    -- Cerrar intro
    local CloseTween = TweenInfo.new(1, Enum.EasingStyle.Quart, Enum.EasingDirection.In)
    local CloseTweenObj = TweenService:Create(MainFrame, CloseTween, {BackgroundTransparency = 1})
    CloseTweenObj:Play()
    
    IntroSound:Destroy()
    ScreenGui:Destroy()
    
    -- Cargar biblioteca UI
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Cat558-uz/Testaaa/refs/heads/main/LibTeste.txt"))()
    
    -- Crear ventana principal
    local Window = MakeWindow({
        Title = "FloppHub | Script Crackeado",
        SubTitle = "by FloppHub LOL",
        SaveFolder = "FloppHub Is Fire | redz lib v5.lua"
    })
    
    -- Botón de minimizar
    Window:AddMinimizeButton({
        Image = "rbxassetid://112586798808707",
        Corner = true,
        CornerRadius = UDim.new(0, 10)
    })
    
    return Window
end

-- ============================================
-- MÓDULO DE NOTIFICACIONES
-- ============================================
function CreateNotificationSystem()
    local NotificationGui = Instance.new("ScreenGui")
    NotificationGui.Name = "NotifyGui"
    NotificationGui.ResetOnSpawn = false
    NotificationGui.Parent = PlayerGui
    
    local NotifFolder = Instance.new("Folder")
    NotifFolder.Name = "NotifFolder"
    NotifFolder.Parent = NotificationGui
    
    local function Notify(text, duration)
        local NotificationFrame = Instance.new("Frame")
        NotificationFrame.Size = UDim2.fromOffset(300, 80)
        NotificationFrame.BackgroundTransparency = 0.1
        NotificationFrame.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
        NotificationFrame.BorderSizePixel = 0
        NotificationFrame.ZIndex = 999
        
        local UICorner = Instance.new("UICorner")
        UICorner.CornerRadius = UDim.new(0, 10)
        UICorner.Parent = NotificationFrame
        
        local UIStroke = Instance.new("UIStroke")
        UIStroke.Thickness = 2
        UIStroke.Color = Color3.fromRGB(100, 100, 100)
        UIStroke.Transparency = 0.5
        UIStroke.Parent = NotificationFrame
        
        local TextLabel = Instance.new("TextLabel")
        TextLabel.Size = UDim2.fromScale(1, 1)
        TextLabel.BackgroundTransparency = 1
        TextLabel.Text = text
        TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
        TextLabel.TextSize = 18
        TextLabel.Font = Enum.Font.GothamBold
        TextLabel.TextWrapped = true
        TextLabel.TextXAlignment = Enum.TextXAlignment.Left
        TextLabel.Parent = NotificationFrame
        
        NotificationFrame.Parent = NotifFolder
        
        -- Animación
        local TweenIn = TweenService:Create(NotificationFrame, 
            TweenInfo.new(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out),
            {Position = UDim2.fromScale(0.85, 0.9)}
        )
        TweenIn:Play()
        
        -- Sonido
        local Sound = Instance.new("Sound")
        Sound.SoundId = "rbxassetid://8486683243"
        Sound.Volume = 0.3
        Sound.Parent = NotificationFrame
        Sound:Play()
        
        -- Auto-destroy
        task.delay(duration or 3, function()
            local TweenOut = TweenService:Create(NotificationFrame,
                TweenInfo.new(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.In),
                {Position = UDim2.fromScale(1.5, 0.9)}
            )
            TweenOut:Play()
            TweenOut.Completed:Wait()
            NotificationFrame:Destroy()
        end)
    end
    
    return Notify
end

-- ============================================
-- MÓDULO DE AURA DE GOLPES (MODIFICADO)
-- ============================================
function ActivateAuraSystem(config)
    local active = false
    local auraRange = config.Range or 35 -- MODIFICADO: Default 35 en vez de 20
    local auraDelay = config.Delay or 0.5
    local maxTargetsPerAttack = 2 -- NUEVO: Máximo 2 jugadores por ataque
    
    local function GetNearbyPlayers()
        local nearby = {}
        local character = GetCharacter()
        if not character then return nearby end
        
        local rootPart = GetHumanoidRootPart()
        if not rootPart then return nearby end
        
        for _, player in ipairs(Services.Players:GetPlayers()) do
            if player ~= LocalPlayer then
                local otherRoot = GetHumanoidRootPart(player)
                if otherRoot then
                    local distance = (rootPart.Position - otherRoot.Position).Magnitude
                    if distance <= auraRange then
                        table.insert(nearby, player)
                    end
                end
            end
        end
        
        return nearby
    end
    
    local function AttackPlayer(player)
        local character = GetCharacter(player)
        if not character then return end
        
        local args = {character, "BullHit", "Stone"}
        ReplicatedStorage.GeneralAbility:FireServer(unpack(args))
    end
    
    -- Loop principal (MODIFICADO para atacar múltiples jugadores)
    task.spawn(function()
        while active do
            local nearbyPlayers = GetNearbyPlayers()
            
            -- Atacar hasta 2 jugadores simultáneamente
            local playersToAttack = math.min(maxTargetsPerAttack, #nearbyPlayers)
            for i = 1, playersToAttack do
                AttackPlayer(nearbyPlayers[i])
            end
            
            -- Esperar el cooldown configurado
            task.wait(auraDelay)
            
            -- Pequeño delay adicional para evitar saturación
            task.wait(0.1)
        end
    end)
    
    return {
        SetActive = function(state) active = state end,
        SetRange = function(range) auraRange = range end,
        SetDelay = function(delay) auraDelay = delay end
    }
end

-- ============================================
-- MÓDULO DE ESP (VISUALIZACIÓN DE JUGADORES)
-- ============================================
function SetupPlayerESP()
    local espObjects = {}
    local espEnabled = false
    
    local function CreateESP(player)
        local character = GetCharacter(player)
        if not character then return end
        
        local rootPart = GetHumanoidRootPart(player)
        if not rootPart then return end
        
        local espBox = Drawing.new("Square")
        espBox.Thickness = 2
        espBox.Filled = false
        espBox.Color = Color3.fromRGB(255, 0, 0)
        espBox.Size = Vector2.new(50, 80)
        
        local espName = Drawing.new("Text")
        espName.Text = player.DisplayName
        espName.Size = 16
        espName.Center = true
        espName.Color = Color3.fromRGB(255, 255, 255)
        espName.Visible = true
        
        espObjects[player.UserId] = {box = espBox, name = espName}
    end
    
    local function RemoveESP(player)
        if espObjects[player.UserId] then
            espObjects[player.UserId].box:Remove()
            espObjects[player.UserId].name:Remove()
            espObjects[player.UserId] = nil
        end
    end
    
    local function UpdateESP()
        if not espEnabled then return end
        
        for _, player in ipairs(Services.Players:GetPlayers()) do
            if player ~= LocalPlayer then
                local character = GetCharacter(player)
                if character and character:FindFirstChild("HumanoidRootPart") then
                    if not espObjects[player.UserId] then
                        CreateESP(player)
                    end
                    
                    local rootPart = character.HumanoidRootPart
                    local screenPos = Workspace.CurrentCamera:WorldToViewportPoint(rootPart.Position)
                    
                    if espObjects[player.UserId] then
                        espObjects[player.UserId].box.Position = Vector2.new(screenPos.X - 25, screenPos.Y - 40)
                        espObjects[player.UserId].name.Position = Vector2.new(screenPos.X, screenPos.Y - 50)
                        espObjects[player.UserId].box.Visible = screenPos.Z > 0
                        espObjects[player.UserId].name.Visible = screenPos.Z > 0
                    end
                else
                    RemoveESP(player)
                end
            end
        end
    end
    
    -- Conectar eventos
    Services.Players.PlayerAdded:Connect(CreateESP)
    Services.Players.PlayerRemoving:Connect(RemoveESP)
    
    RunService.RenderStepped:Connect(UpdateESP)
    
    return {
        Enable = function() espEnabled = true end,
        Disable = function() 
            espEnabled = false
            for _, obj in pairs(espObjects) do
                obj.box:Remove()
                obj.name:Remove()
            end
            espObjects = {}
        end
    }
end

-- ============================================
-- MÓDULO DE FARMING DE SLAPPLES
-- ============================================
function FarmSlapplesAuto()
    local farming = false
    
    local function CollectSlapples()
        local slapplesFolder = Workspace:FindFirstChild("Slapples")
        if not slapplesFolder then return end
        
        for _, slapple in ipairs(slapplesFolder:GetChildren()) do
            if slapple:IsA("BasePart") and slapple.Transparency < 1 then
                local character = GetCharacter()
                if character then
                    character:MoveTo(slapple.Position)
                    task.wait(0.2)
                    
                    -- Click automático
                    local clickDetector = slapple:FindFirstChild("ClickDetector")
                    if clickDetector then
                        fireclickdetector(clickDetector)
                    end
                end
            end
        end
    end
    
    task.spawn(function()
        while farming do
            CollectSlapples()
            task.wait(1)
        end
    end)
    
    return {
        Start = function() farming = true end,
        Stop = function() farming = false end
    }
end

-- ============================================
-- MÓDULO DE PROTECCIÓN ANTI-RAGDOLL
-- ============================================
function AntiRagdollProtection()
    local character = GetCharacter()
    if not character then return end
    
    local function RemoveRagdollScripts()
        for _, descendant in ipairs(character:GetDescendants()) do
            if descendant:IsA("Script") then
                local source = descendant.Source
                if source:find("Ragdolled") or source:find("ragdoll") then
                    descendant:Destroy()
                    print("Script de ragdoll removido: " .. descendant.Name)
                end
            end
        end
    end
    
    character.ChildAdded:Connect(function(child)
        if child:IsA("Script") and child.Name:find("Ragdolled") then
            task.wait(0.1)
            child:Destroy()
            print("Script de ragdoll bloqueado: " .. child.Name)
        end
    end)
    
    RemoveRagdollScripts()
end

-- ============================================
-- MÓDULO DE AUTO-CLICK TYCOON
-- ============================================
function AutoClickTycoon(config)
    local autoclicking = false
    local clickDelay = config.Delay or 0.5
    local clickDistance = config.Distance or 50
    
    local function GetTycoonParts()
        local tycoonParts = {}
        for _, obj in ipairs(Workspace:GetChildren()) do
            if obj.Name:find("Tycoon") then
                local clickDetector = obj:FindFirstChild("ClickDetector")
                if clickDetector then
                    table.insert(tycoonParts, obj)
                end
            end
        end
        return tycoonParts
    end
    
    local function ClickNearestTycoon()
        local character = GetCharacter()
        if not character then return end
        
        local rootPart = GetHumanoidRootPart()
        if not rootPart then return end
        
        local tycoons = GetTycoonParts()
        local nearest = nil
        local minDistance = clickDistance
        
        for _, tycoon in ipairs(tycoons) do
            local distance = (rootPart.Position - tycoon.Position).Magnitude
            if distance < minDistance then
                minDistance = distance
                nearest = tycoon
            end
        end
        
        if nearest then
            local clickDetector = nearest:FindFirstChild("ClickDetector")
            if clickDetector then
                fireclickdetector(clickDetector)
            end
        end
    end
    
    task.spawn(function()
        while autoclicking do
            ClickNearestTycoon()
            task.wait(clickDelay)
        end
    end)
    
    return {
        Start = function() autoclicking = true end,
        Stop = function() autoclicking = false end,
        SetDelay = function(delay) clickDelay = delay end
    }
end

-- ============================================
-- MÓDULO DE TELEPORTE
-- ============================================
function TeleportPlayer(position)
    local character = GetCharacter()
    if not character then return false end
    
    local rootPart = GetHumanoidRootPart()
    if not rootPart then return false end
    
    rootPart.CFrame = CFrame.new(position)
    return true
end

-- ============================================
-- MÓDULO DE UTILIDADES PRINCIPALES
-- ============================================
function GetCharacter(player)
    player = player or LocalPlayer
    return player.Character or player.CharacterAdded:Wait()
end

function GetHumanoidRootPart(player)
    local character = GetCharacter(player)
    return character:FindFirstChild("HumanoidRootPart")
end

function GetToolName()
    local character = GetCharacter()
    local tool = character:FindFirstChildOfClass("Tool")
    return tool and tool.Name or "None"
end

function CheckPlayerDistance(player, maxDistance)
    local myRoot = GetHumanoidRootPart()
    local theirRoot = GetHumanoidRootPart(player)
    
    if not myRoot or not theirRoot then return false end
    
    local distance = (myRoot.Position - theirRoot.Position).Magnitude
    return distance <= (maxDistance or math.huge)
end

-- ============================================
-- INICIALIZACIÓN DEL SCRIPT
-- ============================================
local function Main()
    -- Inicializar UI
    local Window = InitializeHub()
    local Notify = CreateNotificationSystem()
    
    -- Crear tabs principales
    local HomeTab = Window:MakeTab("| Home : Hacks")
    local EspTab = Window:MakeTab("| Esp : Players")
    local TycoonTab = Window:MakeTab("| Auto Click : Tayoon")
    local FarmTab = Window:MakeTab("| Farming : Methods")
    local ProtectionTab = Window:MakeTab("| Protection : ragdoll")
    
    -- Añadir información del ejecutor
    HomeTab:AddParagraph("Execultor", {
        executorName = "Nickname",
        Version = "[almost]"
    })
    
    -- ========================================
    -- SECCIÓN DE HACKS PRINCIPALES
    -- ========================================
    local HacksSection = HomeTab:AddSection("Server")
    
    -- Botón de rejoin
    HacksSection:AddButton("Rejoin Server", function()
        Notify("Reiniciando...", 2)
        task.wait(2)
        Services.TeleportService:Teleport(game.PlaceId, LocalPlayer)
    end)
    
    -- Botón de abrir consola
    HacksSection:AddButton("Abrir Console", function()
        print("ola você abriu o. console[ " .. LocalPlayer.Name .. " ]")
        StarterGui:SetCore("DevConsoleVisible", true)
    end)
    
    -- Toggle de Float Bypass
    local FloatBypassToggle = false
    HacksSection:AddToggle("Float Bypass (New Method Safe)", function(state)
        FloatBypassToggle = state
        if state then
            local Humanoid = GetCharacter():FindFirstChildOfClass("Humanoid")
            if Humanoid then
                Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
            end
        end
    end)
    
    -- ========================================
    -- SECCIÓN DE AURA (MODIFICADA)
    -- ========================================
    local AuraSection = HomeTab:AddSection("| Slap : aura")
    
    local AuraConfig = {
        Range = 35, -- MODIFICADO: Default 35 en vez de 20
        Delay = 0.5,
        Active = false
    }
    
    local AuraSystem = ActivateAuraSystem(AuraConfig)
    
    AuraSection:AddToggle("Aura Bull (Stone)", function(state)
        AuraSystem.SetActive(state)
        AuraConfig.Active = state
    end)
    
    -- MODIFICADO: Default 35 en vez de 20
    AuraSection:AddSlider("Active Studs Aura", function(value)
        AuraSystem.SetRange(value)
        AuraConfig.Range = value
    end, {Min = 5, Max = 50, Default = 35})
    
    -- MODIFICADO: Min 0.5 y Max 10 en vez de 0.1-2
    AuraSection:AddSlider("Delay From Aura ATACK", function(value)
        AuraSystem.SetDelay(value)
        AuraConfig.Delay = value
    end, {Min = 0.5, Max = 10, Default = 0.5})
    
    -- ========================================
    -- SECCIÓN DE ESP
    -- ========================================
    local EspSection = EspTab:AddSection("ESP Master")
    
    local ESP = SetupPlayerESP()
    
    EspSection:AddToggle("ESP Box", function(state)
        if state then ESP.Enable() else ESP.Disable() end
    end)
    
    EspSection:AddToggle("ESP Name", function(state)
        -- Implementar toggle de nombres
    end)
    
    EspSection:AddToggle("ESP Distance", function(state)
        -- Implementar toggle de distancia
    end)
    
    EspSection:AddToggle("ESP Tool", function(state)
        -- Implementar toggle de herramienta
    end)
    
    -- ========================================
    -- SECCIÓN DE TYCOON
    -- ========================================
    local TycoonSection = TycoonTab:AddSection("Tycoon Auto-Click")
    
    local TycoonConfig = {
        Delay = 0.5,
        Distance = 30
    }
    
    local TycoonAutoClick = AutoClickTycoon(TycoonConfig)
    local AutoClickEnabled = false
    
    TycoonSection:AddToggle("Auto Click Tycoon", function(state)
        AutoClickEnabled = state
        if state then
            TycoonAutoClick.Start()
        else
            TycoonAutoClick.Stop()
        end
    end)
    
    TycoonSection:AddSlider("Click Speed", function(value)
        TycoonConfig.Delay = value
        TycoonAutoClick.SetDelay(value)
    end, {Min = 0.1, Max = 1, Default = 0.5, Increase = 0.1})
    
    -- Botón destruir todos los tycoons
    TycoonSection:AddButton("Destroy All Tycoons", function()
        for _, obj in ipairs(Workspace:GetChildren()) do
            if obj.Name:find("Tycoon") then
                local destruct = obj:FindFirstChild("Destruct")
                if destruct and destruct:FindFirstChild("ClickDetector") then
                    fireclickdetector(destruct.ClickDetector)
                end
            end
        end
        Notify("Destruyendo todos los tycoons...", 3)
    end)
    
    -- ========================================
    -- SECCIÓN DE FARMING
    -- ========================================
    local FarmSection = FarmTab:AddSection("Farming Methods")
    
    local SlappleFarmer = FarmSlapplesAuto()
    local FarmingEnabled = false
    
    FarmSection:AddToggle("Farm 2 auto collected slapples", function(state)
        FarmingEnabled = state
        if state then
            SlappleFarmer.Start()
            Notify("Farm de slapples iniciado", 2)
        else
            SlappleFarmer.Stop()
            Notify("Farm de slapples detenido", 2)
        end
    end)
    
    FarmSection:AddButton("Auto TP All Slapples", function()
        local slapples = Workspace:FindFirstChild("Slapples")
        if slapples then
            for _, slapple in ipairs(slapples:GetChildren()) do
                if slapple:IsA("BasePart") then
                    TeleportPlayer(slapple.Position + Vector3.new(0, 5, 0))
                    task.wait(0.5)
                end
            end
        end
    end)
    
    -- ========================================
    -- SECCIÓN DE PROTECCIÓN
    -- ========================================
    local ProtectSection = ProtectionTab:AddSection("Anti-Ragdoll")
    
    ProtectSection:AddToggle("Protection Ragdoll (Freezer)", function(state)
        if state then
            AntiRagdollProtection()
            Notify("Protección anti-ragdoll activada", 2)
        end
    end)
    
    ProtectSection:AddToggle("Protection Ragdoll (Reset)", function(state)
        if state then
            -- Implementar protección por reset
        end
    end)
    
    -- ========================================
    -- TELEPORT A ZONAS SEGURAS
    -- ========================================
    local SafeZones = {
        {Name = "Safe Zone 1", Pos = Vector3.new(0, 100, 0)},
        {Name = "Safe Zone 2", Pos = Vector3.new(100, 100, 100)},
        {Name = "Safe Zone 3", Pos = Vector3.new(-100, 100, -100)},
        {Name = "Safe Zone 4", Pos = Vector3.new(50, 100, -50)},
        {Name = "Safe Zone 5", Pos = Vector3.new(-50, 100, 50)}
    }
    
    local TeleportSection = ProtectionTab:AddSection("TP : Safe Zones")
    
    for _, zone in ipairs(SafeZones) do
        TeleportSection:AddButton("TP : " .. zone.Name, function()
            TeleportPlayer(zone.Pos)
            Notify("Teletransportado a " .. zone.Name, 2)
        end)
    end
    
    -- Notificación de carga
    Notify("Redz Hub cargado correctamente!", 3)
    
    -- Bucle para mantener la UI actualizada
    task.spawn(function()
        while true do
            if HomeTab and HomeTab.Update then
                HomeTab:Update()
            end
            task.wait(1)
        end
    end)
end

-- Ejecutar script
local success, err = pcall(Main)
if not success then
    warn("Error en Redz Hub: " .. tostring(err))
end
